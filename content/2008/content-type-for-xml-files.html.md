---
title: "Content-type for XML files"
date: 2008-06-11
tags:
  - "Programming"
  - "Unicode"
  - "XML"
author: "Philihp Busby"
---

<p>When reporting the Content-Type of an XML document (such as in the HTTP response headers) use "application/xml", rather than "text/xml".</p>
<p>
<p>The reason for this is because the first line of your XML document should tell the client what the encoding of the document is anyway.</p>
<p>
<pre>&lt;?xml version="1.0" encoding="<strong>charset</strong>"?&gt;</pre>
<p>
<p>If you were to use text/xml, you'd need to report the character set there, and this could conflict. You may end up with an HTTP response that looks like:</p>
<p>
<pre>HTTP/1.1 200 OK<br />Date: Wed, 11 Jun 2008 20:48:36 GMT<br />Server: Apache/1.3.41 (Unix) mod_jk/1.2.4 PHP/4.4.7<br />Content-Type: text/xml; charset=<strong>iso-8859-1</strong><br /><br />&lt;?xml version="1.0" encoding="<strong>utf-8</strong>"?&gt;<br />&lt;data&gt;...&lt;/data&gt;</pre>
