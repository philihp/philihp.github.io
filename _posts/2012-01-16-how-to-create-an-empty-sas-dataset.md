---
layout: post
title: How to Create an Empty SAS Dataset
date: 2012-01-16T07:24:50Z
tags:
  - data step
  - How To
  - Programming
  - SAS
redirect_from:
  - /blog/2012/how-to-create-an-empty-sas-dataset.html
---

If you were to do this in SAS to create an empty SAS dataset:

```sas
data mytable;
run;
```

It would actually create a dataset with one row. The data step cycles through once, hits the end (run), outputs a row, then comes back and finds it has no more rows to process so it stops. To stop this one row from being output, try this instead:

```sas
data mytable;
  stop;
run;
```
