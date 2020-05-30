---
layout: post
title: Class 'foo' has no initializers
date: 2016-06-04 20:32:24.000000000 -07:00
tags:
  - initializers
  - swift
redirect_from:
  - /blog/2016/class-foo-has-no-initializers/
---

Quick post. It's been a while. I'm just starting out with Swift, and this error kept coming up for me, but the error message could be a little more descriptive. It means that you have a non-optional member variable that needs to be initialized somehow.

```swift
class Foo: NSObject {
  var bar: String
}
```

That block will fail, saying `Class 'Foo' has no initalizers`. It isn't that you need an `init` custructor, it's that other things will depend on bar being set, and Swift doesn't know what value to give it. This can be fixed by making bar optional, and anything using bar will have to handle the case where it's missing

```swift
class Foo: NSObject {
  var bar: String?
}
```

or by giving it an initial value, so anything using it will either get its value, or (in this case) an empty string

```swift
class Foo: NSObject {
  var bar: String = ""
}
```
