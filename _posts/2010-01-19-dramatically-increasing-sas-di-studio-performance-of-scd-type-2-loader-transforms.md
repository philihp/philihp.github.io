---
layout: post
title: Dramatically Increasing SAS DI Studio performance of SCD Type-2 Loader Transforms
date: 2010-01-19T21:55:35Z
tags:
  - "3.4"
  - 9.1.3
  - Data Integration Studio
  - DI Studio
  - Index
  - Optimization
  - Programming
  - SAS
  - SCD Type-2 Loader
  - Slowly Changing Dimension
---

<a href="http://www.sas.com/technologies/dw/entdiserver/index.html"
    ><img
      src="{{ post.baseurl }}/assets/SCDLoader2.png"
      alt="SCD Loader"
      title="SCD Loader"
      width="316"
      height="94"
      class="alignright size-full wp-image-544" /></a>
In SAS DI Studio 3.4 (and I imagine in future versions), the prepackaged code
for the SCD Type-2 Loader works like this: Does the dataset exist? If not,
create an empty dataset with structure and indexes as defined from metadata.
Then detect differences between it and the source dataset and the target
dataset, expire any observations that are modified or deleted by setting their
valid-to-date to now, and append any modified or new observations with a
valid-from-date. The expire bit is done in-place with a data step modify
statement, and the append is done with PROC APPEND. I assume this is done to
reduce the amount of locking necessary on the dimension dataset. Because new
observations are appended, the dataset never actually gets sorted by the
business key, so this could lead to exponential growth over time on the expire
bit; every time the transform wants to change a single observation's
valid-to-date, it scans the entire table. And it doesn't help that compression
is off by default.

In the instance below, we had an uncompressed dataset with a modest 220,000
rows. The dataset had a variable "description" defined as a 4000-length string
which was usually but not always null. Most steps of the SCD Loader run in a
few seconds, but the following is usually the bottleneck. On a run one night
to populate a new variable, this data step ran in a little over 9 hours:

```sas
data PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST;
  modify PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST
      work.etls_close
      (rename = (ETLS_KEY = SW_ENTITY_REL_X_HOST_ID
      ETLS_FROMDATE = VALID_FROM_DTTM))
      updatemode=nomissingcheck;
  by SW_ENTITY_REL_X_HOST_ID VALID_FROM_DTTM;
  VALID_TO_DTTM = ETLS_CLSDATE;
  if %sysrc(_SOK) eq _iorc_ then
      replace;
  _iorc_ = 0;
  _error_ = 0;
run;
```

```
NOTE: There were 1 observations read from the data set PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST.
NOTE: The data set PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST has been updated.  There were 45924 observations rewritten, 0
     observations added and 0 observations deleted.
NOTE: There were 45924 observations read from the data set WORK.ETLS_CLOSE.
NOTE: DATA statement used (Total process time):
     real time           9:06:00.46
     cpu time            9:05:58.43
```

Turning compression on reduced the size of this dataset from 1.1 gigs to 4.5
megs, mostly from compressing the 4000-char string that was usually empty;
with compression off, an X-length string always takes up X bytes because it's
faster to seek to a certain observation if all observations are the same size.
Additionally, in metadata an index was defined on the two variables used above
in the BY statement. I ran this PROC DATASETS statement to create the index by
hand (the Loader would create them if the table didn't exist, but it assumes
indexes exist if the table exists).

```sas
proc datasets library=prestage nolist;
 modify load_sw_entity_release_x_host;
 index create ndx=(sw_entity_rel_x_host_id valid_from_dttm) / unique;
quit;
```

With this metadata in place, the SCD Loader uses the index in the datastep and
generates the following datastep instead:

```sas
data PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST;
  set work.etls_close(rename = (ETLS_KEY = SW_ENTITY_REL_X_HOST_ID
                                ETLS_FROMDATE = VALID_FROM_DTTM));

  modify PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST
      key=ndx / unique;
  /* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */

  VALID_TO_DTTM = ETLS_CLSDATE;
  if %sysrc(_SOK) eq _iorc_ then
      replace;
  _iorc_ = 0;
  _error_ = 0;
run;
```

By using the index, the runtime was reduced to under two seconds.

```
NOTE: There were 45924 observations read from the data set WORK.ETLS_CLOSE.
NOTE: The data set PRESTAGE.LOAD_SW_ENTITY_RELEASE_X_HOST has been updated.  There were 45924 observations rewritten, 0
     observations added and 0 observations deleted.
NOTE: DATA statement used (Total process time):
     real time           1.41 seconds
     cpu time            1.21 seconds
```
