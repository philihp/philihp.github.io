---
layout: post
title: Using Java 8 Lambdas with Google Guava Caches
date: 2015-09-28 08:12:38.000000000 -07:00
tags:
  - cache
  - Google
  - guava
  - java8
  - lambda
  - Programming
redirect_from:
  - /blog/2015/using-java-8-lambdas-with-google-guava-caches/
---

<p>With Guava, you can define a simple in-memory cache with</p>

```java
import static java.util.concurrent.TimeUnit.DAYS;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

Cache<K, V> cache =
    CacheBuilder.newBuilder()
        .maximumSize(100000)
        .expireAfterAccess(7, DAYS)
        .build();
```

<p>With this you can use .put(K, V) to load values, and .getIfPresent(K), which returns null if the key isn't present. Sometimes it's more convenient to use <a href="http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/cache/Cache.html#get(K,%20java.util.concurrent.Callable)">get(K key, Callable&lt;? extends V&gt; valueLoader)</a>, where the valueLoader is called on a cache miss, and populates the cache and gives you what a cache hit would have given you. The <a href="https://github.com/google/guava/wiki/CachesExplained#from-a-callable">old Java 7 way</a> of doing this was really ugly:</p>

```java
cache.get(key, new Callable() {
    @Override
    public V call() {
        return calculatedValue(key);
    }
});
```

<p><a href="https://xkcd.com/1513/">Don't write ugly code</a>. With Java 8 Lambdas, just do this:</p>

```java
cache.get(key, () -> {
    calculatedValue(key);
}
```
