---
title: "Java for-each iterating with a Scanner"
date: 2012-03-03
tags:
  - "for"
  - "for-each"
  - "iterate"
  - "Java"
  - "java 5"
  - "loop"
  - "Programming"
  - "Scanner"
  - "split"
author: "Philihp Busby"
---

<p>Usually you want to do something like this, with <a href="http://docs.oracle.com/javase/1.4.2/docs/api/java/lang/String.html#split(java.lang.String)">String.split(...)</a></p>
<pre lang="Java">
for(String unit : units.split(",")) {
  System.out.println("unit: "+unit);
}
</pre>
<p>But if for some reason you need the functionality that <a href="http://docs.oracle.com/javase/1.5.0/docs/api/java/util/Scanner.html">Scanner</a> affords, and although it's probably not very readable, you can use an anonymous class to do it like this</p>
<pre lang="Java">
for (String unit : new Iterable<string>() {
        public Iterator<string> iterator() {
          Scanner scanner = new Scanner(units);
          scanner.useDelimiter(",");
          return scanner;
        }
      }) {
  System.out.println("unit: " + unit);
}
</string></string></pre>
