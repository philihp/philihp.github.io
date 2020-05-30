---
layout: post
title: "Handlebars #each in a Play Scala View"
date: 2013-10-13 02:23:27.000000000 -07:00
tags:
  - each
  - handlebars
  - play
  - play-framework
  - Programming
  - scala
redirect_from:
  - /blog/2013/handlebars-each-in-a-play-scala-view/
---

If you're using Play Scala views with Handlebars in them, and you get errors that look like these:

<pre>
<b>not found: value key</b>
In /home/phil/myproject/app/views/myview.scala.html at line 108.
</pre>

or

<pre><b>not found: value index</b>
In /home/phil/myproject/app/views/myview.scala.html at line 108.</pre>

It's probably because you're using `{% raw %}{{@index}}{% endraw %}` when iterating through an array with `{% raw %}{{#each myarray}}{% endraw %}` or `{% raw %}{{@key}}{% endraw %}` when iterating through an object's properties.

This happens because Play framework views are Scala, and the `@` character is a special character. Scala thinks you're trying to access a Scala value (and comes back with the error above). You'll need to escape it with `@@` so Scala will pass it along as just a single `@` for Handlebars to see. It looks like this:

```handlebars
{% raw %}
{{#each objects}}
  {{@key}}:{{this}}
{{/each}}
{% endraw %}
```
