---
layout: post
title: Prefer `if object.present?` over `if object`
date: 2018-08-17 00:53:12.000000000 -07:00
categories: []
tags:
  - decorator
  - draper
  - present
  - Programming
  - rails
  - ruby
redirect_from:
  - /blog/2018/prefer-if-object-present-over-if-object/
---

So you've got a controller method

```ruby
class DressesController < ApplicationController
  def show
    @dress = Dress.find_by(params.permit(:id))
  end
end
```

And a view

```erb
<div class="<%= dress ? 'dress&.status' : '' %>">Status Indicator</div>
```

Looks good! Works great! Now your app grows, and you have a lot of other views that use the dress. Long after your view has been forgotten, and there's no clear owner because <a href="https://www.agilealliance.org/glossary/collective-ownership/">everyone owns it</a>, but that's cool because it's regarded as stable, someone comes along and builds another view

```erb
<h1><%= dress.named? ? dress.name.gsub(' ','_').titleize : 'Unnamed' %></h1>
```

Ew gross, so much logic in the view? Gross! Let's put that logic in a <a href="https://github.com/drapergem/draper">decorator</a>!

```ruby
class DressDecorator < Draper::Decorator
  delegate_all
  def title
    dress.named? ? dress.name.gsub(' ','_').titleize : 'Unnamed'
  end
end
```

<code>delegate_all</code> will forward all methods it's sent to whatever it's decorating.

```ruby
class DressesController < ApplicationController
  def show
    @dress = DressDecorator.new(Dress.find_by(params.permit(:id)))
  end
end
```

And let's clean up our view.

```ruby
<h1><%= dress.title %></h1>
```

But now @dress will always be there, even if it decorates nil, so our old code is broken, and will return

```
NoMethodError (undefined method `status' for #<DressDecorator:0x00007fbc2696d568>)
```

Because of this, it's always important to <a href="https://medium.freecodecamp.org/how-to-make-your-code-better-with-intention-revealing-function-names-6c8b5271693e">code your intention</a>, rather than code to save keystrokes. Use <code>dress.present?</code>, because that's what you're checking, even though it's the same as <code>dress</code> <i>right now</i>.

```erb
<div class="<%= dress.present? ? 'dress&.status' : '' %>">Status Indicator</div>
```

In other words, watch out for this...

```ruby
d = Dress.new(foo: 'bar')
!d.nil?
=> true
d.present?
=> true
d&.foo
=> 'bar'

dd = DressDecorator.new(d)
!dd.nil?
=> true
dd.present?
=> false
dd&.foo
```

```
Traceback (most recent call last):
NameError (undefined local variable or method `foo' for main:Object)
```
