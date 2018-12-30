---
layout: post
title: How to use JUnit4 Hamcrest Matchers
date: 2015-01-14 10:22:40.000000000 -08:00
tags:
  - hamcrest
  - Java
  - junit
  - maven
redirect_from:
  - /blog/2015/how-to-use-junit4-hamcrest-matchers/
---

<p>JUnit borrows matchers from a library called Hamcrest, which look a lot like RSpec matchers in Ruby. They can be tricky to write, but end up being much more readable for complex assertions. At its simplest case, we can turn this assertion</p>

```java
assertTrue(board.isGameOver());
```

<p>into</p>

```java
assertThat(board.isGameOver(), is(true));
```

<p>It's slightly wordier, but I think it reads in English a little better, and is capable of still-readable more-complex assertions. The <code>is()</code> function here isn't from extending TestCase (JUnit 4 no longer needs this, that was a JUnit 3 thing). It's actually a static import, although there seems to be conflicting information on the internet on what needs to be imported. I found these to work in most cases:</p>

```java
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
```

<p>From what I can tell, JUnit pulled in some, but not all of the matchers from Hamcrest. There are still some useful matchers in Hamcrest, so I like to import them, and there aren't any namespace collisions. It doesn't add any additional lines to your POM since you can actually leave out the JUnit dependency and just import the Hamcrest library (since it itself depends on JUnit).</p>

```xml
<dependency>
  <groupid>org.hamcrest</groupid>
  <artifactid>hamcrest-all</artifactid>
  <version>1.3</version>
  <scope>test</scope>
</dependency>
```

<p><a href="https://github.com/philihp/weblabora/blob/ba158acf6733a961599ef7925a8f8c6926351060/src/test/java/com/philihp/weblabora/model/Game53955Test.java">In the actual test that motivated this post</a>, I had a really specific need to test that a method would return a list which contained at any index a POJO bean which had properties for <code>settlement</code> being an instance of a Village class and <code>score</code> being 42. I was able to express this as</p>

```java
assertThat(
      settlementScoresList,
      hasItem(allOf(
          hasProperty("settlement", instanceOf(Village.class)),
          hasProperty("score", is(42)))));
```
