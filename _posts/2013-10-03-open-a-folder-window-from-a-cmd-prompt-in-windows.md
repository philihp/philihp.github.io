---
layout: post
title: Open a folder window from a terminal in Windows and macOS
date: 2013-10-03T14:50:46Z
tags:
  - cmd
  - folder
  - Interesting Things
  - open
  - windows
---

Easy way to open up a folder window while in a command line prompt. This opens a window to wherever you are, in case.

```
C:\>mkdir tempdir
C:\>cd tempdir
C:\tempdir>explorer .
```

On macOS, you can just do this

```bash
$ mkdir tempdir
$ cd tempdir
$ open .
```
