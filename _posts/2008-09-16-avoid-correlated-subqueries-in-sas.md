---
layout: post
title: Avoid Correlated Subqueries in SAS
date: 2008-09-16T03:58:00Z
tags:
  - Optimization
  - Programming
  - SAS
  - SQL

redirect_from:
  - /2009/avoid-correlated-subqueries.html
---

If your SQL code has a nested select that references a column in an outer select, such as the following, it may be possible to rewrite to perform orders of magnitude faster.

```sas
proc sql;
   create table new_rates as
   select
     from work.exchange_rate n
     where not exists(
       select  from imf.exchange_rate o
       where n.effective_date=o.effective_date and n.iso_char_code=o.iso_char_code );

NOTE: Table WORK.NEW_RATES created, with 49 rows and 4 columns.

 quit;

NOTE: PROCEDURE SQL used (Total process time):
     real time           8.83 seconds
     cpu time            8.65 seconds
```

Here, the table imf.exchange_rate has 13416 rows, covering exchange rates at close, daily, for 39 different currencies, over nearly 1 year. Modest, but fairly small. It has no indexes, and has not been sorted (or marked as sorted). work.exchange_rate is a smaller version of it, covering only exchange rates for the last month, with 980 rows. The query is trying to return any exchange rates that we didn't have before.

Should be simple right? There's no reason for it to take this long. By rewriting the query to do a left join, below, SAS merges the tables behind the scenes, then finishes the query in a single scan.

```sas
proc sql;
   create table new_rates as
   select n.*
     from work.exchange_rate n
       left join imf.exchange_rate o
         on (n.effective_date = o.effective_date and n.iso_char_code = o.iso_char_code)
     where o.iso_char_code = '';

NOTE: Table WORK.NEW_RATES created, with 49 rows and 4 columns.

 quit;

NOTE: PROCEDURE SQL used (Total process time):
     real time           0.13 seconds
     cpu time            0.13 seconds
```
