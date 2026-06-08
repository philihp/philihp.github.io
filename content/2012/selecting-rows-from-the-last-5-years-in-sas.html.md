---
title: "Selecting Rows from the Last 5 Years in SAS"
date: 2012-12-06
tags:
  - "date"
  - "intck"
  - "interval"
  - "intnx"
  - "Programming"
  - "SAS"
  - "window"
  - "year"
author: "Philihp Busby"
---

<p>I was asked recently in a Q&amp;A, "how to select the last 5 years worth of data from a table in SAS?" One way of doing it is by selecting the data with a Proc SQL query similar to the following, and something similar could also be done in a data step:</p>
<pre lang="sas">PROC SQL;
  create table mywindow as
  select ...myvariables...
    from mylib.mytable
    where year(mydate) between year(today())-5 and year(today());
QUIT;</pre>
<p><i>Caveat emptor</i>, this is really only going to include the last 4 complete years and whatever portion of the current year is in the dataset. This is because year() truncates out the month and day of the date.</p>
<p>Of course, this is just one way to do it. By using the intnx function, more advanced intervals can be done.</p>
<p>SAS Documentation:</p>
<ul>
<li><a href="http://support.sas.com/documentation/cdl/en/lefunctionsref/63354/HTML/default/viewer.htm#p13eycdrmfb0l8n1492z3wocpt3s.htm">YEAR function</a></li>
<li><a href="http://support.sas.com/documentation/cdl/en/lefunctionsref/63354/HTML/default/viewer.htm#p0hm9egy8s7mokn1mz0yxng80ax5.htm">TODAY function</a></li>
<li><a href="http://support.sas.com/documentation/cdl/en/etsug/65545/HTML/default/viewer.htm#etsug_tsdata_sect047.htm">Interval Functions INTNX and INTCK</a></li>
</ul>
