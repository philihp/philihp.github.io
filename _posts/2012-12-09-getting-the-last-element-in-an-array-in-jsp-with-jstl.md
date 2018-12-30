---
layout: post
title: Getting the last element in an array in JSF and JSTL
date: 2012-12-09 19:15:45.000000000 -08:00
tags:
  - el
  - Java
  - jsf
  - jsp
  - jstl
  - last
  - length
  - Programming
  - size

redirect_from:
  - /blog/2012/getting-the-last-element-in-an-array-in-jsp-with-jstl/
---

I'd love it if JSTL had some sort of way to get the last element in an array. Ruby conveniently makes negative indexes start from the end of the array:

```ruby
myarray[-1]
```

For some reason, lists and arrays in Java have ".length" and ".size()" accessors, instead of either getLength() or getSize(), and there isn't a convenience method for this. And for some reason, this has never been corrected, and the old way deprecated. Who knows? Bad decisions from the start have a way of growing like cancer. In JSTL and JSF, which relies heavily on getters for property accessing, there's a helper function for this: [fn:length()](http://docs.oracle.com/javaee/5/tutorial/doc/bnalg.html). Using this, you can get the last element of an array like this:

```java
${myArray[fn:length(myArray)-1]}
```

or in JSF

```jsf
#{myArray[fn:length(myArray)-1]}
```

Maybe someone at <s>Sun</s> Oracle will see this and add it to Java 9?
