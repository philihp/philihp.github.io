---
layout: post
title: Abusing Hash objects as a Stack in SAS Data Step
date: 2010-05-07T21:00:40Z
tags:
  - data step
  - hash
  - Metadata
  - Programming
  - recursion
  - SAS
  - stack
  - traverse
---

Everyone in the computer science field (<em>should</em>) eventually learn or realize that any recursive function can be rewritten as an iterative process with the aid of a stack. Since a SAS Data Step is iterative, it's fairly easy to look up children of a tree node in metadata, but nearly impossible to recursively look up children of children, and so fourth, without breaking out of the Data Step loop and into macro code, because there's no native program stack.

You can use the [LINK](http://support.sas.com/documentation/cdl/en/lrdict/62618/HTML/default/a000201972.htm) keyword, but that just keeps the [PC register](http://en.wikipedia.org/wiki/Program_counter) in a stack to return to where you were a subroutine was called, it doesn't recreate the data vector. Because of this, all variables in a SAS Data Step behave as global within the data step block.

You could use a _TEMPORARY_ array as a stack, but its size has to be hard-coded to a predetermined depth.

SAS 9 has a rarely used Hash object, which can be used within a Data Step. It grows as needed, so it can be used to function as a functionally infinite length array, and further abused to function as a stack within a Data Step. The following code demonstrates this:

```sas
data _null_;
  declare hash stack();
  length stackvar $100;
  length stackdepth 8.;
  stackdepth=0;
  rc=stack.defineKey('stackdepth');
  rc=stack.defineData('stackvar');
  rc=stack.defineDone();

stackvar='a';
stackdepth+1;
rc=stack.add();
put 'push' stackdepth= stackvar=;

stackvar='b';
stackdepth+1;
rc=stack.add();
put 'push' stackdepth= stackvar=;

stackvar='c';
stackdepth+1;
rc=stack.add();
put 'push' stackdepth= stackvar=;

rc=stack.find();
rc=stack.remove();
put 'pop' stackdepth= stackvar=;
stackdepth+-1;

rc=stack.find();
rc=stack.remove();
put 'pop' stackdepth= stackvar=;
stackdepth+-1;

rc=stack.find();
rc=stack.remove();
put 'pop' stackdepth= stackvar=;
stackdepth+-1;

stackvar='x';
stackdepth+1;
rc=stack.add();
put 'push' stackdepth= stackvar=;

stackvar='y';
stackdepth+1;
rc=stack.add();
put 'push' stackdepth= stackvar=;

stackvar='z';
stackdepth+1;
rc=stack.add();
put 'push' stackdepth= stackvar=;

rc=stack.find();
rc=stack.remove();
put 'pop' stackdepth= stackvar=;
stackdepth+-1;

rc=stack.find();
rc=stack.remove();
put 'pop' stackdepth= stackvar=;
stackdepth+-1;

rc=stack.find();
rc=stack.remove();
put 'pop' stackdepth= stackvar=;
stackdepth+-1;
run;
```

It outputs this:

```
pushstackdepth=1 stackvar=a
pushstackdepth=2 stackvar=b
pushstackdepth=3 stackvar=c
popstackdepth=3 stackvar=c
popstackdepth=2 stackvar=b
popstackdepth=1 stackvar=a
pushstackdepth=1 stackvar=x
pushstackdepth=2 stackvar=y
pushstackdepth=3 stackvar=z
popstackdepth=3 stackvar=z
popstackdepth=2 stackvar=y
popstackdepth=1 stackvar=x
```

By doing this, you can traverse a tree in metadata.
