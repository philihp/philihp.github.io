---
layout: post
title: Dynamically Added ActiveRecord Where Clauses
date: 2019-07-02T00:44:00Z
categories: []
tags:
  - rails
  - ruby
  - activercord
  - arel
  - dynamic
---

Often times I'll come across a chain of ActiveRecord relations, like this:

```
Thing.where(color: 'blue').where(size: 'large').where(weight: 'heavy').where(created_at: 2.days.ago..DateTime::Infinity.new)
```

And sometimes it might be necessary to build this list of conditions dynamically, so if my conditions are represented in the list

```
conditions = [
  { color: 'blue' },
  { size: 'large' },
  { weight: 'heavy' },
  { created_at: 2.days.ago..DateTime::Infinity.new },
]
```

One way of combining these together is

```ruby
Thing.where(conditions.join(' AND '))
```

However if instead of constants, I used variables then, then an analizer like Breakman could see this as a potential SQL injection vulnerability. To mitigate this, you can do

```ruby
Thing.where(conditions.join(Arel.sql(' AND '))).
```

But I feel that this is a little awkward. What is that `Arel.sql` doing in there, casting a magic AND string? Another way to do this is to use an inject/reduce:

```ruby
conditions.inject(Thing) { |query, condition| query.where(condition) }
```

But this can be further reduced (pun!) to

```ruby
conditions.inject(Thing, &:where)
```
