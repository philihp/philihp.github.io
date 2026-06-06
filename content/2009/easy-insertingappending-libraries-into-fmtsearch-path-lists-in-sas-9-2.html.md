---
title: "Easy Inserting/Appending Libraries into FMTSEARCH path lists in SAS 9.2"
date: 2009-10-27
tags:
  - "FMTSEARCH"
  - "Formats"
  - "Programming"
  - "SAS"
  - "SAS 9.2"
  - "SASAUTOS"
author: "Philihp Busby"
---

<p>In SAS 9.1.3 and prior, Options list (such as FMTSEARCH for libraries with format catalogs, and SASAUTOS for paths that contain macros shared across jobs) were annoying to work with. If you have nested code that wants to add a library or a path the list, doing so like this could potentially clobber statements executed outside of the nested block:</p>
<pre>OPTIONS FMTSEARCH=(<i>mylib.formats</i>);</pre>
<p>To really be safe, you want to add your library to the list. Doing this wasn't very intuitive. I had always done this like this:</p>
<pre>%let FMTSEARCH = %substr(%sysfunc(getoption(fmtsearch) ) ,2);
OPTIONS FMTSEARCH = (<i>mylib.formats</i> &FMTSEARCH;</pre>
<p>But in 9.2, there are two new System Options, <a href="http://support.sas.com/documentation/cdl/en/lrdict/62618/HTML/default/a003273966.htm">INSERT=</a> and <a href="http://support.sas.com/documentation/cdl/en/lrdict/62618/HTML/default/a003273971.htm">APPEND=</a>. This is now as simple as</p>
<pre>OPTIONS INSERT=(FMTSEARCH=<i>mylib.formats</i>);</pre>
