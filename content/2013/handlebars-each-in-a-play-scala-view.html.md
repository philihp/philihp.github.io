---
title: "Handlebars #each in a Play Scala View"
date: 2013-10-13
tags:
  - "each"
  - "handlebars"
  - "play"
  - "play-framework"
  - "Programming"
  - "scala"
author: "Philihp Busby"
---

If you're using Play Scala views with Handlebars in them, and you get errors that look like these:

<pre>
<b>not found: value key</b>
In /home/phil/myproject/app/views/myview.scala.html at line 108.
</pre>

or

<pre><b>not found: value index</b>
In /home/phil/myproject/app/views/myview.scala.html at line 108.</pre>

It's probably because you're using `{{@index}}` when iterating through an array with `{{#each myarray}}` or `{{@key}}` when iterating through an object's properties.

This happens because Play framework views are Scala, and the `@` character is a special character. Scala thinks you're trying to access a Scala value (and comes back with the error above). You'll need to escape it with `@@` so Scala will pass it along as just a single `@` for Handlebars to see. It looks like this:

```handlebars

{{#each objects}}
  {{@key}}:{{this}}
{{/each}}

```
