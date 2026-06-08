---
title: "Backward for loop iteration in Python"
date: 2009-01-02
tags:
  - "Programming"
  - "Python"
author: "Philihp Busby"
---

<p>So lately I've been hacking up Python on the self imposed restriction of running everything on a 450 MHz Pentium II. This way if I ever do anything less-than-optimal, it's immediately obvious, and I don't learn any bad habits.</p>
<p>Then I came across the following optimization.</p>
<pre><code>>>> import os<br />>>> for k, v in os.environ.items():<br />...     print "%s=%s" % (k, v)</code></pre>
<p>Pretty direct, right? Iterate through the os.environ hash, and print every key/value pair. But <a href="http://diveintopython.org/file_handling/for_loops.html">Diveintopython.org</a> showed me I can do better using List Comprehensions.</p>
<pre><code>>>> print "n".join(["%s=%s" % (k, v) for k, v in os.environ.items()])</code></pre>
<p>This is better, because it builds the string first, then calls print once. Neat!</p>
<p>It works like this:
<ul>
<li><code>"n".join(<i>L</i>)</code> takes the list <code><i>L</i></code> and joins the elements a string with <code>"n"</code> between each element.</li>
<p>
<li><code>[<i>f</i> for k, v in <i>K</i>]</code> applies the function or statement <code><i>f</i></code> to each variable <code>k, v</code> in the list of key-value pairs <code><i>K</i></code>.</li>
<p>
<li><code>"%s=%s" % (k, v)</code> is like saying <code>printf("%s=%s",k,v)</code> in another language.</li>
<p>
<li><code>os.environ.items()</code> says take the dictionary of <code>os.environ</code>, and turn it into a list, where each element is a key-value pair</li>
<p></ul>
