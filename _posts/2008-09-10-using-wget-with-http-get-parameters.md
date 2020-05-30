---
layout: post
title: Using WGET with HTTP GET Parameters
date: 2008-09-10 22:44:00.000000000 -07:00
tags:
  - HTTP
  - Programming
  - WGET
redirect_from:
  - /blog/2008/using-wget-with-http-get-parameters/
---

WGET is a simple tool that is usually on a lot of shell boxes. I think it might be installed by default on Linux. Sometimes you have to get it installed by your admin.

At any rate, it's useful for downloading a resource from a simple web service like so:

```
wget http://www.asdf.com/jkl.html
```

You can even attach parameters to it

```
wget http://www.google.com/search?q=asdf
```

Just be sure that if you attach two or more parameters, you enclose the command in quotes; otherwise the shell thinks the command ends at the ampersand and your request won't go through correctly.

```
wget "http://www.imf.org/external/np/fin/data/rms_mth.aspx?SelectDate=2008-09-30&reportType=SDRCV"
```
