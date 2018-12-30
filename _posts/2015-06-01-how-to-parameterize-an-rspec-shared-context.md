---
layout: post
title: How to parameterize an RSpec shared context
date: 2015-06-01 09:51:00.000000000 -07:00
tags:
  - factorygirl
  - factorybot
  - mock
  - options
  - parameterized
  - Programming
  - rspec
  - ruby
  - shared_context
  - variable
redirect_from:
  - /blog/2015/using-java-8-lambdas-with-google-guava-caches/
---

<p>I had a RSpec shared_context which was creating a FactoryGirl user mock and then logging in with it, and then running some shared examples for testing permissions on a generic user. I needed to modify it to accept a parameter of using a different user.</p>
<p>It originally looked like this:</p>

```ruby
RSpec.shared_context "auth" do
  let(:current_user) { FactoryGirl.create(:user) }

  before(:each) do
    allow(User).to receive(:find_by_id)
    allow(User).to receive(:find_by_id).with(current_user.id) { current_user }
  end

  shared_context "logged in" do
    before(:each) do
      login_as current_user
    end
  end
end
```

<p>In my spec files, it was included by doing this:</p>

```ruby
describe MyController do
  include_context 'auth'

  context "when logged in as a normal user" do
    include_context 'logged in'

    ...
  end
end
```

<p>However I needed MyController to override current_user and use an admin user instead. Rather conveniently, you can override a context by sending it a block.</p>

```ruby
describe MyController do
  include_context 'auth'

  context "when logged in as an admin" do
    include_context 'logged in' do
      let(:current_user) { FactoryGirl.create(:admin) }
    end

    ...
  end
end
```

<p>This works because the let inside of the block given is called again, and the new block calls <code>let(:current_user)</code> again and overrides the original block and <code>FactoryGirl.create(:user)</code> is never called.</p>

<p><a href="https://www.relishapp.com/rspec/rspec-core/docs/example-groups/shared-context#declare-a-shared-context,-include-it-with-`include-context`-and-extend-it-with-an-additional-block">This is documented here</a>, however they don't really show that it can be used for making your shared_context parameterized. So I'm going to say the word parameterized a lot here, and hope that when I (or you!) google "How do I parameterize an RSpec shared_context?", you find this post.</p>
