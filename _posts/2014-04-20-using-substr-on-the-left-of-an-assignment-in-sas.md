---
layout: post
title: Using SUBSTR on the left of an assignment in SAS
date: 2014-04-20T01:46:57Z
tags:
  - perl
  - Programming
  - SAS
  - substr
---

This is a pretty cool feature, and as far as I know it's unique to SAS and Perl. [In SAS, you can have a substr to the left of an assignment](http://support.sas.com/documentation/cdl/en/lrdict/64316/HTML/default/viewer.htm#a000212267.htm).

```sas
stringDate='29MAR1984';
substr(stringDate,3,3)='FEB';
```

This avoids potentially awkward situations like this:

```sas
stringDate='29MAR1984';
stringDate=substr(stringDate,1,2)||'FEB'||substr(stringDate,6,4);
```

The bounds don't have to be static. Lets suppose we have a dataset with 1 row per letter, and we want to combine those letters into a word.

```sas
data have;
    input letter $1.;
    datalines;
h
e
l
l
o
;
run;
```

My initial thought was to just retain and append each letter:

```sas
data want;
  length word $200;
  retain word;
  set have nobs=nobs;
  call cats(word,letter);
  if(nobs=_n_) then output;
run;
```

However this breaks if one of the letters is a space, and SAS treats the space as null, so appending a space has no effect on the string. Instead of appending, just stick the letter where it's supposed to be.

```sas
data want;
  length word $200;
  retain word ' ';
  set have nobs=nobs;
  substr(word,_n_,1) = letter;
  if(_n_==nobs) then output;
run;
```
