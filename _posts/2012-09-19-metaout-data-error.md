---
layout: post
title: METAOUT=DATA error in SAS Enterprise Guide
date: 2012-09-19T21:43:11Z
type: post
tags:
  - enterprise guide
  - libname
  - Library
  - Metadata
  - metaout
  - Programming
  - SAS
redirect_from:
  - /blog/2012/metaout-data-error.html
---

### The Symptom

In Enterprise Guide 4.3, I kept running into this problem. Whenever I had a
remote server, and a library created on it, I couldn't create a new table in
the library without first creating a stub table metadata object. I couldn't
take a Query Builder's output going to WORK, and instead change that to a
permanent library and expect it to work. EG would send the right code to SAS,
and SAS would return this error:

```code
> ERROR: You cannot create or delete datasets, views or indexes in this
> mode. Try the option METAOUT=DATA. Use Proc Metalib to create metadata for
> datasets.
```

_What mode!?_

### The Diagnosis

The problem is that by default, Enterprise Guide opens libraries from the
server in a sort of read-only mode. It's not allowed to create (or delete)
datasets that were not already defined and registered in the metadata server.
This protects us from cluttering up the server and keeps the DBAs from yelling
at us, but might not be expected, especially in a single-user environment.

From SAS's perspective, we had allocated a library using the
[Metadata LIBNAME Engine](http://support.sas.com/documentation/cdl/en/lrmeta/60739/HTML/default/viewer.htm#a003091733.htm)
, and tried to create a table in the library that wasn't registered. It sends
back a totally reasonable error message, but to us using Enterprise Guide it's
totally cryptic. Totally. We, as the user, probably just said "hey, use this
library", and are probably unaware of what libname engine was used (and maybe
even unaware of what a libname engine even is).

### The Prognosis

There's an easy way to fix this, and it can be done from Enterprise Guide.
It's easy to miss though, because
_it must be done to a library while it is unassigned_. If the library
is assigned (the icon is yellow and colorful), unassign it (so the icon is
grey and not filled in). You may have to close your current project because
some of your tables from it might still be in use.

### The Cure

Find the library in the library under your server ("SASApp" by default). Right
click on it and open the properties. If the library is still assigned, you'll
get a read-only modal window come up, but if the library was unassigned,
you'll be able to change stuff.

Click the second option on the left, "Assignment" and then uncheck the option
"**Show only tables with metadata definitions**".

[caption id="attachment_1078" align="aligncenter" width="300"]<a
    href="http://www.philihp.com/blog/wp-content/uploads/2012/09/metaout.png"
    ><img
      class="size-medium wp-image-1078"
      title="metaout"
      src="{{ post.baseurl }}/assets/metaout-300x160.png"
      alt=""
      width="300"
      height="160"
  /></a>
Turning off the Metadata Safety[/caption]

Read more:

- [Managing Libraries with SAS Enterprise Guide](http://support.sas.com/documentation/cdl/en/enclient/61192/HTML/default/viewer.htm#a002117808.htm)
- [What SAS Administrators Should Know about Libraries, Metadata, and SAS Enterprise Guide](http://support.sas.com/documentation/onlinedoc/guide/EG43MetaLibraries.pdf)
