---
layout: post
title: How to use a SWITCH Statement in SAS
date: 2012-04-09 22:04:26.000000000 -07:00
tags:
  - if else
  - Programming
  - SAS
  - select
  - statement
  - switch
redirect_from:
  - /blog/2012/sas-switch-statement
---

In SAS, the switch statement is called a SELECT statement.

When a select expression is given, it evaluates this and does a relative jump,
which is similar to the optimization done by a C or Java compiler in a switch
statement. It doesn't have any fall-throughs though, so it's more like Ruby.
It looks like this:

```sas
select(i);
  when(0) put 'none';
  when(1) put 'one';
  when(2) put 'a couple';
  when(3,4,5) put 'a bunch';
  otherwise put 'a lot';
end;
```

In SAS there's a second mode for using it, where the expression after SELECT
is left out. The closest similarity to another language I know of is
<a href="http://phpswitch.com/">PHP's switch</a> with
<code>switch(true)</code> and using cases with conditions, however PHP's
version still has fall-through. Doing this in SAS looks like this:

```sas
select;
  when(i<5) put 'lt 5';
  when(i=5) put 'eq 5';
  when(i>5) put 'gt 5';
  otherwise put 'math is broken';
end;
```

The statement is basically
<a href="http://en.wikipedia.org/wiki/Syntactic_sugar">syntactic sugar</a> to
make your code easier to read, and is logically no different from a chain of
<code>if</code>/<code>else-if</code>/<code>else-if</code>/<code>else</code>
statements. The statement will break out after the first statement evaluates
true, even if statements further down would also evaluate true. It isn't any
different from

```sas
if(i<5) then put 'lt 5';
else if(i=5) then put 'eq 5';
else if(i>5) then put 'gt 5';
else put 'math is broken';
```

Possible advantages:

- Statements can be reordered and/or dynamically inserted through SAS's macro preprocessor runs without having to worry about if it needs an "if" or an "else if".
- For OCD-types, the formatting can look prettier.
- For <a href="http://codegolf.com/">golfers</a>, it uses fewer keystrokes.
