---
layout: post
title: How to write your own Custom SAS Functions
date: 2012-11-20 17:30:13.000000000 -08:00
tags:
  - Custom
  - functions
  - How To
  - Metadata
  - proc fcmp
  - Programming
  - SAS
  - user-written
redirect_from:
  - /blog/2012/how-to-write-your-own-custom-sas-functions/
---

Since SAS 9.1.3 we've had the ability to write our own SAS call procedures and
functions using PROC FCMP (short for "Function Compiler"). A simple example of
this is as follows:

```sas
proc fcmp outlib=work.funcs.temp;
  function findname(uri $) $200;
    length name $200;
    rc = metadata_getattr(uri,'Name',name);
	return(name);
  endsub;
run;
```

After running this, we should have a custom function available for use in any
data step. The function listed here will contact the SAS Metadata Server using
[metadata_getattr](http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/viewer.htm#getattr.htm)
and return the "Name" attribute of an object at the given URI. You'll have to
add that location to the cmplib search path (similar to adding a location to a
format search path), which can be achieved by doing

```sas
options cmplib=work.funcs;
```

If you do so, the following data step

```sas

options cmplib=work.funcs;
data _null_;
  uri = 'omsobj:PhysicalTable/A5M6KWHB.BI00001E';
  name = findname(uri);
  put name=;
run;
```

will output

```
name=MYTABLE
```

because I have a table registered in my metadata called "MYTABLE" at that location.

The possibilities with PROC FCMP are seemingly endless. For example,
user-written functions allow you to write recursive calls. Before FCMP, you
either had to write recursive SCL
[which had an arbitrary stack limit of 10](http://support.sas.com/documentation/cdl/en/sclref/59578/HTML/default/viewer.htm#a000164465.htm), or recursive Macro calls which makes
[calling system functions cumbersome](http://support.sas.com/documentation/cdl/en/mcrolref/61885/HTML/default/viewer.htm#z3514sysfunc.htm). Learn more about it
[here](http://support.sas.com/documentation/cdl/en/proc/65145/HTML/default/viewer.htm#p10b4qouzgi6sqn154ipglazix2q.htm).
