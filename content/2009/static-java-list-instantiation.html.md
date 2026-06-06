---
title: "Static Java List Instantiation"
date: 2009-05-16
tags:
  - "Example"
  - "Java"
  - "List"
  - "Programming"
author: "Philihp Busby"
---

<p>I've been out of the loop on straight Java programming for a while, so this is probably obvious to a lot of people, and has been for a long time. But on the off chance that I'm not the only other idiot out there, I'll post this.</p>
<p>The old way of instantiating a <a href="http://java.sun.com/j2se/1.5.0/docs/api/java/util/List.html">List</a> in Java was like this:</p>
<pre name="code" class="java:nocontrols">List strings = Arrays.asList(new String[]{"foo","bar"});</pre>
<p>In Java 5, templates were introduced, so I had to change to doing this:</p>
<pre name="code" class="java:nocontrols">List&lt;String&gt; strings = Arrays.asList(new String[]{"foo","bar"});</pre>
<p>It just occurred to me that with variable-length methods, I can simply call asList like this:</p>
<pre name="code" class="java:nocontrols">List&lt;String&gt; strings = Arrays.asList("foo","bar");</pre>
