---
title: "SQL Optimization: Union vs. Union All"
date: 2010-05-27
tags:
  - "Optimization"
  - "Programming"
  - "SQL"
  - "Union"
author: "Philihp Busby"
---

<p>Everyone should learn the difference between Union and Union All. Knowing it will make you a better programmer, and it's fairly trivial to understand.</p>
<pre>SELECT * FROM apples
UNION
SELECT * FROM oranges</pre>
<p>When you know for a fact that there will never be any common rows between the <code>apples</code> table and the <code>oranges</code> table, this query will be slightly faster with at low cardinality, and incredibly faster at high cardinality by using "UNION ALL"</p>
<pre>SELECT * FROM apples
UNION ALL
SELECT * FROM oranges</pre>
<p>The difference between the two queries is this: UNION ALL will simply concatenate the two queries together into the resultset. Just using UNION will concatenate, but then remove duplicates (do a distinct sort). Leaving out this second step can vastly reduce the time it takes for your query to run.</p>
