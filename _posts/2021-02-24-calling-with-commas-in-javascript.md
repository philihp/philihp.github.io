---
layout: post
title: Calling with Commas in Javascript
date: 2021-02-24T09:02:00Z
categories: []
tags:
  - javascript
  - ramda
  - wtf
---

If you want to call something multiple times, it's easy

```js
const f = () => console.log("f() called");

f();
// f() called
f();
// f() called
f();
// f() called
```

But that's _so basic_. You can also do it this way.

```js
[1, 2, 3].forEach(f);

// f() called
// f() called
// f() called
// => undefined
```

But those constant literals there are clouding up the whole business. Gross, but we can remove them!

```js
[, ,].forEach(f);

// => undefined
```

But wait! `f()` isn't called for every element, then! What gives? There's a hint here if we use `Array.map` instead...

```js
[, ,].map(f);

// => [ <2 empty items> ]
```

It's because of [copy elision](https://en.wikipedia.org/wiki/Copy_elision) here. But if we use [Ramda#map](https://ramdajs.com/docs/#map), it does work.

```js
const R = require("ramda");
R.map(f, [, ,]);

// f() called
// f() called
// => [ undefined, undefined ]
```

But it's only called twice! What gives? This is because of [trailing commas in arrays](https://github.com/denysdovhan/wtfjs#trailing-commas-in-array). It's a feature, not a bug.

```js
const ff = R.forEach(f);
ff([, , ,]);

// f() called
// f() called
// f() called
// => <3 empty items>
```

Enjoy your job security!
