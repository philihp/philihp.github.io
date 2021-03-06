---
layout: post
title: Converting between Date and Datetime in SAS
date: 2009-06-01 21:01:10.000000000 -07:00
tags:
  - Dates
  - Programming
  - SAS
redirect_from:
  - /blog/2009/converting-a-date-to-a-datetime-in-sas/
---

<p>In SAS, fields are either character of varying length, or numeric. No exceptions. Temporal values such as Date and Date/Time are stored as either the number of days or seconds since 1960 January 1st.</p>
<p>In order to convert from Date/Time to Date, and from Date to Date/Time, you could divide or multiply respectively by 86400 (the number of seconds in a day).</p>

```sas
data _null_;
  d='29FEB1984'd;
  put d date.;
  <strong>dt=d*24*60*60;</strong>
  put dt datetime.;
  <strong>d=dt/24/60/60;</strong>
  put d date.;
run;
```

<p>But unless someone deals with dates every day, it might not be obvious to them by reading this code what those <a href="http://en.wikipedia.org/wiki/Magic_number_(programming)">magic numbers</a> are doing.</p>
<p>Another method would be to use <a href="http://support.sas.com/onlinedoc/913/getDoc/en/lrdict.hlp/a000199354.htm">put</a>() and <a href="http://support.sas.com/onlinedoc/913/getDoc/en/lrdict.hlp/a000180357.htm">input</a>() using functions to go back and fourth.</p>

```sas
data _null_;
  d='29FEB1984'd;
  put d date.;
  <strong>dt=input(put( d  ,date7.) || ':00:00:00', datetime.);</strong>
  put dt datetime.;
  <strong>d =input(substr(put(dt,datetime.),1,7),date7.);</strong>
  put d date.;
run;
```

<p>But I don't consider this any better. It's wordy. Functions are nested within functions. And you still have a magic number for the call to substr. Also, since it isn't uncommon for SAS datasets to get into the billions of rows, this probably isn't the fastest way to do it.</p>
<p>SAS has built-in functions called <a href="http://support.sas.com/onlinedoc/913/getDoc/en/lrdict.hlp/a000179419.htm">dhms</a>() (mnemonic: date,hour,minute,second) and <a href="http://support.sas.com/onlinedoc/913/getDoc/en/lrdict.hlp/a000245883.htm">datepart</a>() that should make things a lot easier.</p>

```sas
data _null_;
  d='29FEB1984'd;
  put d date.;
  <strong>dt=dhms(d,0,0,0);</strong>
  put dt datetime.;
  <strong>d =datepart(dt);</strong>
  put d date.;
run;
```
