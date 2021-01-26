---
layout: post
title: SAS Macro Variable Resolution Timing
date: 2014-02-06T00:04:43Z
tags:
  - macro
  - Programming
  - resolution
  - SAS
---

I thought this was neat and quirky. The implications of it are important, too. When you assign a macro variable in SAS, it doesn't resolve immediately. It resolves It will also warn you if the variable doesn't exist yet, too.

```sas
%let x = &y;
%let y = z;
%put &x;
```

Will output

```
z
```

Even though, when x was defined, y did not exist. We'll get the following warning, which can be ignored.

```
WARNING: Apparent symbolic reference Y not resolved.
```

I'd love to know if there's a way of turning off that warning.
