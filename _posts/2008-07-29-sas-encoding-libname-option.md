---
layout: post
title: SAS Encoding Libname Option
date: 2008-07-29T19:01:00Z
tags:
  - Programming
  - SAS
  - Unicode
---

So my coworker was having a problem where he was reading a dataset that he did not own. It was a SAS9 dataset encoded in UTF-8, and contained ™ (U+2122), the trade mark sign. His SAS session was running a local encoding of latin1, ISO_8859-1, which did not have it.

My instinct says, it should convert it into U+FFFD or U+001A, but sometimes SAS does convert things to 0x1A, so I don't know.

> U+FFFD is used to replace an incoming character whose value is unknown or unrepresentable in Unicode compare the use of U+001A as a control character to indicate the substitute function

What SAS _does_ do is this. It stops the current block, and returns an error that looks like this:

```
ERROR: Some character data was lost during transcoding in the dataset SRC.THEIR_TABLE.
NOTE: The data step has been abnormally terminated.
NOTE: The SAS System stopped processing this step because of errors.
NOTE: SAS set option OBS=0 and will continue to check statements. This may cause NOTE: No observations in data set.
NOTE: There were 664 observations read from the data set SRC.THEIR_TABLE.
WARNING: The data set WORK.LOCAL_DATASET may be incomplete.  When this step was stopped there were 664 observations and
         26 variables.
NOTE: DATA statement used (Total process time):
      real time           0.43 seconds
      cpu time            0.40 seconds</pre>
```

Using all sorts of variations of the "encoding" dataset option was not helping. We eventually landed upon the following solution:

```sas
libname srclib inencoding=latin1 server=shr1 hostname="remote.example.com" access=readonly;
```

The `inencoding` needed to be the encoding of what we wanted our datasets to be when they got to SAS, regardless of what they were on the source library. YMMV.
