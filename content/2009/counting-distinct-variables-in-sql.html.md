---
title: "Counting distinct variables in SQL with SAS"
date: 2009-10-26
tags:
  - "Count"
  - "Distinct"
  - "Programming"
  - "SAS"
  - "SQL"
author: "Philihp Busby"
---

<p>One way to get the count of distinct variables, which works in most flavors of SQL, is to use a subquery. For instance, in Oracle this is:</p>
<pre>SELECT count(SELECT DISTINCT foo FROM table) FROM dual</pre>
<p>In SAS, using PROC SQL, you can do that too, but you can also simply do this:</p>
<pre>SELECT count(distinct foo) FROM table</pre>
