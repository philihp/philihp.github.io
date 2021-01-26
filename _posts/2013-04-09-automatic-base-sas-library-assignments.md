---
layout: post
title: Automatic Base SAS Library Assignments
date: 2013-04-09T19:19:16Z
tags:
  - "8.2"
  - 9.1.3
  - "9.2"
  - "9.3"
  - autoexec
  - automatic
  - base
  - Library
  - Programming
  - SAS
---

If you stick a file named `autoexec.sas` in the directory where SAS is installed, it will run automatically when SAS starts up. By default, this place is `C:\Program Files\SASHome\SAS\Foundation\9.3`. This has worked since _at least_ SAS 8.2, probably before.</p>

I like to use my Windows desktop as a temporary staging area, so I have my `autoexec.sas` automatically assign a "DESKTOP" library with this code:</p>

```sas
%let USERPROFILE=%sysget(USERPROFILE);
libname desktop "&USERPROFILE\Desktop";
```

So when SAS starts up, the library is assigned and my log says this:</p>

```text
NOTE: Copyright (c) 2002-2010 by SAS Institute Inc., Cary, NC, USA.
NOTE: SAS (r) Proprietary Software 9.3 (TS1M2)
      Licensed to Microsoft Windows for x64 All Compatible Non-Plann, Site  XXXXXXX.
NOTE: This session is executing on the X64_7PRO  platform.



NOTE: Enhanced analytical products:

SAS/STAT 12.1, SAS/ETS 12.1, SAS/OR 12.2, SAS/IML 12.1, SAS/QC 12.1

NOTE: SAS initialization used:
      real time           0.65 seconds
      cpu time            0.63 seconds


NOTE: AUTOEXEC processing beginning; file is C:\Program
      Files\SASHome\SAS\Foundation\9.3\\autoexec.sas.

NOTE: Libref DESKTOP was successfully assigned as follows:
      Engine:        V9
      Physical Name: C:\Users\philihp\Desktop

NOTE: AUTOEXEC processing completed.
```
