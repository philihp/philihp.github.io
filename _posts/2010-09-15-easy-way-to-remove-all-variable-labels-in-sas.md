---
title: Easy Way to Remove All Variable Labels in SAS
date: 2010-09-15 15:02:09.000000000 -07:00
tags:
  - Labels
  - Proc Datasets
  - Programming
  - SAS
redirect_from:
  - /blog/2010/easy-way-to-remove-all-variable-labels-in-sas/
---

The hard way to remove a label in SAS is to list out all of the labels one-by-one, like this

```sas
data mylib.mydataset;
  set mylib.mydataset;
  label varA='';
  label varB='';
  label varC='';
run;
```

But if you don't know all of the variables ahead of time, or just want something cleaner/faster, you can do this

```sas
proc datasets library=mylib nolist;
  modify mydataset;
  attrib _all_ label='';
quit;
```
