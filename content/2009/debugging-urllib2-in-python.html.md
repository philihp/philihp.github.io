---
title: "Debugging Urllib2 in Python"
date: 2009-01-16
tags:
  - "Programming"
  - "Python"
author: "Philihp Busby"
---

<p>I was having some trouble debugging an HTTP request using urllib2 in Python which did some unorthodox things with HTTP headers. The urllib2 module itself doesn't have much debug facility. You can see response headers by looking at the hdrs attribute on the exception like this</p>
<pre><code>try:
  opener.open(<i>url</i>)
except urllib2.HTTPError, e:
  print e.hdrs
</code></pre>
<p>But in order to see the actual request string, you've got to go a layer deeper. Urllib2 runs on top of Httplib, so do this before you make your request</p>
<pre><code>import httplib
httplib.HTTPConnection.debuglevel = 1</code></pre>
