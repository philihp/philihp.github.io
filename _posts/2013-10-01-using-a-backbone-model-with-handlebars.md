---
layout: post
title: Using a Backbone Model with Handlebars
date: 2013-10-01T06:36:50Z
tags:
  - backbone
  - collection
  - handlebars
  - javascript
  - model
  - Programming
---

A [Backbone](http://backbonejs.org/) model's property has to be accessed with the `get(property)` method.

```js
var myObj = Backbone.Model.extend({ ... });
//don't do this
console.log(myObj.myProp);

//do this instead
console.log(myObj.get('myProp'));
```

If you're trying to pass this object to a [Handlebars.js](http://handlebarsjs.com/), things start to get messy. If you've got a template like this

```js
var myTemplate = Handlebars.compile("Property: {{ myObj.myProp }}");
console.log(myTemplate(myObj));
```

Handlebars won't find the property, and nothing will be displayed. There's a well-known workaround to this though, which is to convert the Backbone Model into JSON

```js
console.log(myTemplate(myObj.toJSON()));
```

However this isn't as readable as I'd prefer. If your collection gets really big, it can make your application slow, and in situations where you've got a Backbone Collection of Models, it doesn't even work. [A. Matias Quezada](http://amatiasq.com) has [a better solution](https://gist.github.com/amatiasq/4710958), which is to tell Handlebars, "hey, if it's a Model, use the get method":

```js
Handlebars.JavaScriptCompiler.prototype.nameLookup = function (
  parent,
  name,
  type
) {
  var result =
    "(" +
    parent +
    " instanceof Backbone.Model ? " +
    parent +
    '.get("' +
    name +
    '") : ' +
    parent;
  if (/^[0-9]+$/.test(name)) {
    return result + "[" + name + "])";
  } else if (
    Handlebars.JavaScriptCompiler.isValidJavaScriptVariableName(name)
  ) {
    return result + "." + name + ")";
  } else {
    return result + "['" + name + "'])";
  }
};
```

That's it. If you run that somewhere before your Template runs, Handlebars will be able to find the Backbone Model's property.

_In writing this post, I also came across [Thorax.js](http://thoraxjs.org/), which probably also fixes this problem._
