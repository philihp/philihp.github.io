---
layout: post
title: How to get the Last Day of a Month in SAS
date: 2011-09-20 23:15:39.000000000 -07:00
tags:
  - Dates
  - intnx
  - magic
  - Programming
  - SAS
redirect_from:
  - /blog/2011/how-to-get-the-last-day-of-a-month-in-sas/
  - /blog/2011/how-to-get-the-last-day-of-a-month-in-sas.html
---

SAS has a really neat function called [intnx](http://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a000212700.htm), which will increment a date to the next of an interval.

For example, if you have a date (any date. maybe the current date?), you can get the date of the first day of the next month by doing this:

```sas
data _null_;
  d = '11JUN2011'd;
  format d date9.;
  put d;
  d = intnx('month',d,1);
  put d;
run;
```

Which outputs

```
11JUN2011
01JUL2011
```

Here's a clever way to get the "Last Day" of the current month. The last day of the current month is the day before the first day of the next month. SAS Dates are internally stored as a number of days since some point, so just subtract one from it.

```sas
data _null_;
  d = '11JUN2011'd;
  format d date9.;
  put d;
  d = intnx('month',d,1)-1;
  put d;
run;
```

Which outputs

```
11JUN2011
30JUN2011
```
