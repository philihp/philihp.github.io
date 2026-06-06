---
title: "Looping through SAS metadata objects"
date: 2010-05-05
tags:
  - "for"
  - "loop"
  - "Metadata"
  - "Programming"
  - "SAS"
author: "Philihp Busby"
---

<p>The following is my attempt at SAS Golf, where in a Data Step, I try to list the associations of a metadata object to the log. This is basically just taking advantage of combining SAS for loops with SAS while loops. I thought it was cool. Usually I find myself doing this with <a href="http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/getnasn.htm">metadata_getnasn</a>, <a href="http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/getnprp.htm">metadata_getnprp</a>, and <a href="http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/getnobj.htm">metadata_getnobj</a></p>
<ul>
<li>n - index for the nth association</li>
<li>u - uri to object</li>
<li>a - association</li>
</ul>
<pre lang="sas">data;
  ...
  do n=1 by 1 while(n&lt;r or r&lt;=0);
    r=metadata_getnasl(u,n,a);
    put a;
  end;
  ...
run;</pre>
<p><strong>UPDATE:</strong> The <a href="http://support.sas.com/kb/19/977.html">metadata_getnass</a> function has been renamed to <a href="http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/getnasn.htm">metadata_getnasn</a></p>
