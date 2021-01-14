---
layout: post
title: Removing the First Instance of an Element from a ES6 JavaScript Array
date: 2018-10-01 20:54:06.000000000 -07:00
tags:
  - array
  - es6
  - functional
  - Programming
  - remove
  - slice

redirect_from:
  - /blog/2018/removing-the-first-instance-of-an-element-from-a-es6-javascript-array/
---

To build upon
<a
  href="https://blog.mariusschulz.com/2016/07/16/removing-elements-from-javascript-arrays">Marius Schulz</a>'s approaches to removing from an array, if you want to remove the first
instance of an element in an array, and you don't want to mutate it but
instead return a new array (because perhaps you want your
<a
  href="https://lorenstewart.me/2017/01/22/javascript-array-methods-mutating-vs-non-mutating/">React components to update</a>), use a slice.

```javascript
function removeFirst(src, element) {
  const index = src.indexOf(element);
  if (index === -1) return src;
  return [...src.slice(0, index), ...src.slice(index + 1)];
}
```

This will give a new array every time.

```javascript
const src = ["a", "a", "a", "b", "b", "c"];
removeFirst(src, "a"); // "a,a,b,b,c"
removeFirst(src, "b"); // "a,a,a,b,c"
removeFirst(src, "c"); // "a,a,a,b,b"
```

This might seem wasteful, but now you can depend on the identity of the
response to change if the array itself changed. If they're the same, and you
pass this in as a property to a React component,
<a
  href="https://medium.com/@baphemot/note-that-purecomponent-does-a-shallow-comparison-of-props-so-if-you-use-complex-data-structures-8675023e0b92">the component knows it doesn't have to change</a>.

```javascript
const src = ["a", "a", "a", "b", "b", "c"];
removeFirst(src, "a") === src; // false
removeFirst(src, "b") === src; // false
removeFirst(src, "c") === src; // false
removeFirst(src, "x") === src; // true
```
