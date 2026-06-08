---
title: "Removing formats from all variables in a SAS Dataset"
date: 2009-08-12
tags:
  - "Formats"
  - "Programming"
  - "SAS"
author: "Philihp Busby"
---

<p>In SAS, every field/variable in a table/dataset can be given a format. This format tells SAS how to display the data. The following datastep will create a table called "formatted" having 1 row containing 3 variables: x, y, and d.</p>
<pre>data formatted;
  x=9000;
  y=42;
  now=16761;
  format x comma6.;
  format y dollar5.;
  format now date7.;
  put x=;
  put y=;
  put now=;
run;</pre>
<p>Additionally it prints to the log the formatted values.</p>
<pre>x=9,000
y=$42
now=21NOV05</pre>
<p>In SAS you can also create your own formats, and you can assign these formats to whichever datasets you like. However if that format goes away for some reason and you try to look at the data again, you will get this error:</p>
<pre>ERROR: Informat $YOURFMT not found or couldn't be loaded for variable YOURVAR.</pre>
<p>You can get around this by turning off this option</p>
<pre>options nofmterr;</pre>
<p>Then your ERROR turns into NOTE, and things work normally, except when you try to view the data you see it unformatted. This could be useful, however, if you find yourself in a situation like this:</p>
<pre>data _null_;
  a=20.0000001;
  b=20.000001;
  format a dollar4.2;
  format b dollar4.2;
  put a= b=;
  if(a=b) then put 'matches';
   else put 'no match';
run;</pre>
<p>Runs and outputs:</p>
<pre>a=20.0 b=20.0
no match</pre>
<p>At any rate, there are times in SAS when you simply want to remove all the formats from a dataset. This can be done in one line in a datastep:</p>
<pre>
data unformatted;
  set formatted;
  format _all_;
run;
</pre>
