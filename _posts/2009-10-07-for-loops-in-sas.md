---
layout: post
title: For loops in SAS
date: 2009-10-07 16:06:22.000000000 -07:00
tags:
  - For loops
  - List iteration
  - Metadata
  - Programming
  - SAS
redirect_from:
  - /blog/2009/for-loops-in-sas/
---

When coding for loops in SAS, one neat thing to remember is that all of the parts of it are optional.

<blockquote><p>DO <b>variable=</b>start<br />
  &nbsp;&nbsp;&lt;TO stop&gt;<br />
  &nbsp;&nbsp;&lt;BY increment&gt;<br />
  &nbsp;&nbsp;&lt;WHILE(expression) | UNTIL(expression)&gt;<br />
  &nbsp;&nbsp;...<br />
  END;</p>
<p><a href="http://support.sas.com/documentation/cdl/en/lrdict/62618/HTML/default/a000201276.htm"><cite>http://support.sas.com/documentation/cdl/en/lrdict/62618/HTML/default/a000201276.htm</cite></a></p></blockquote>

So in another language, what might be

```c
for(int i=0;i < max;i++) {
```

In SAS, you can leave out the "by 1", since it's the default increment. So this would be

```sas
do i=0 to max;
```

What's fun is in SAS you can combine a <a href="http://en.wikipedia.org/wiki/Do_while_loop">Repeat-Until/Do-While</a> loop with a for loop. This might be useful if for some reason you don't set the var "max" until you've iterated through the loop once, such as in this case, where "<a href="http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/getnobj.htm">metadata_getnobj</a>" returns a negative on fail, but otherwise returns the number of objects that match the query.

```sas
do i=1 by 1 until (i >= objs);
  rc=metadata_getnobj("omsobj:SASLibrary?@Libref='MYLIBREF'",i,uri);
  if rc>=0 then objs=rc;

  rc=metadata_getnasn(uri,"LibraryConnection",1,uri);
  if rc>=0 then leave;
end;
```

This code loops through all the libraries in the metadata with libref='MYLIBREF', and exits with a URI for the first one it sees with at least one LibraryConnection association. This is useful when you have a remote library pointing to a local library and they both have the same name and you want a URI to the remote one.

Another cool thing with FOR loops in SAS is iteration through lists. In Java, say you have a block like this:

```java
for(String x : new String[] { "a","b","c" }) {
  System.out.println("x="+x);
}
```

<p>In SAS, this is simply</p>

```sas
do x="a","b","c";
  put x=;
end;
```
