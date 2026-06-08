---
title: "New in Java 7: switch()ing on Strings"
date: 2012-01-22
tags:
  - "eclipse"
  - "Java"
  - "java 7"
  - "PHP"
  - "Programming"
  - "string"
  - "switch"
author: "Philihp Busby"
---

<p>Finally, <a href="http://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html">Java can switch on Strings</a>! No more inefficient strings of if/else chains or Hash lookups or translation into Enums. Finally just clean readable and intuitive code.</p>
<pre lang="Java">
switch(suit) {
  case "club":
  case "diamond":
    trickValue = 20;
    break;
  case "heart":
  case "spade":
    trickValue = 30;
    break;
  case "no-trump":
    trickValue = 40;
    break;
}
</pre>
<p>It's actually just syntactic sugar. The <a href="http://blogs.oracle.com/darcy/entry/project_coin_strings_in_switch">java compiler renders this all down to int switching</a> by pre-computing the <code>.hashcode()</code> of all of the labels since they have to be constants anyway (unlike languages like PHP where you can do <a href="http://programmersnotes.info/2009/03/06/trick-with-php-switch/">some really neat shenanigans</a>). Because this still renders down to primitives, Java still gets the <a href="http://en.wikipedia.org/wiki/Jump_table">jump table optimizations</a> that were the whole motivation of the switch construct in the first place.</p>
<p>If you use Eclipse, switching on a String will still probably give you an error. <a href="https://bugs.eclipse.org/bugs/show_bug.cgi?id=288548#c9">It wasn't until September 2011's release (3.7.1)</a> that this was implemented. There were versions of Indigo that didn't support this, so you'll need the latest one.</p>
