---
layout: post
title: Changing a SAS Dataset's Encoding
date: 2008-06-20T20:44:00Z
tags:
  - Programming
  - SAS
  - Unicode
---

In SAS9, every dataset should have an "encoding" property that specifies the charset of the bytes in its character variables. You can manually set this without having SAS try to transcode it into a new encoding by using a proc datasets modify.

```sas
data work.src(encoding='any');
  length s $20;
  s = '6E756C6C'x;
  output;
  s = 'C3B1C3BC6C6C'x;
  output;
  s = 'C58475C582C582'x;
  output;
run;

proc datasets library=work;
  modify src / correctencoding=utf8;
run;
```
