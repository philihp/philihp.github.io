---
layout: post
title: Multiple Instances of the Same Embedded JPA Entity
date: 2012-02-12 04:37:22.000000000 -08:00
tags:
  - Denormalized
  - EclipseLink
  - Embeddable
  - Embedded
  - Java
  - jpa
  - Multiple
  - Programming
redirect_from:
  - /blog/2012/multiple-instances-of-the-same-embedded-jpa-entity/
---

<p>EclipseLink JPA has this neat feature of <a href="http://en.wikibooks.org/wiki/Java_Persistence/Embeddables">@Embedded</a> objects, which allow you to pull out attributes of an entity into another entity, and embed that second entity back into the first object. The result is a Java object that might look a little more logical, but doesn't actually change the database structure since the embedded object's fields are still on the first object.</p>
<p>To illustrate this, imagine we have a Person object who has an Address.</p>

```java
@Entity public class Person {
  @Id @GeneratedValue public int personId;
  @Basic private String name;
  @Basic private String locationCity;
  @Basic private String locationState;
  ...
}
```

<p>It might make sense to pull out the address into another entity, but maybe for speed or legacy reasons we have to keep a denormalized table structure. Using an Entity with the @Embeddable annotation, we can still do this on the JPA end of things. It would look like this:</p>

```java
@Entity public class Person {
  @Id @GeneratedValue private int personId;
  @Basic private String name;
  @Embedded private Location location;
  ...
}
```

```java
@Embeddable public class Location {
  @Basic private String city;
  @Basic private String state;
  ...
}
```

<p>EclipseLink will just treat all of the attributes of Location as attributes of Person, and it all works out. JPQL queries should change, but for the most part all of your Java code looks a lot more logical. None of your queries will have any joins.</p>
<p>But say you're starting with a structure like this</p>

```java
@Entity public class Person {
  @Id @GeneratedValue public int personId;
  @Basic private String name;
  @Basic private String homeLocationCity;
  @Basic private String homeLocationState;
  @Basic private String workLocationCity;
  @Basic private String workLocationState;
  ...
}
```

<p>You could create two embeddable objects called HomeLocation and WorkLocation, each with a City and State, but that that violates <a href="http://en.wikipedia.org/wiki/Don't_repeat_yourself">DRY</a>. Usually I'd throw caution to the wind and say to hell with that, but we can save ourselves some effort here by just creating a Location object as we did before and having Person include it twice.</p>

```java
@Entity public class Person {
  @Id @GeneratedValue private int personId;
  @Basic private String name;
  @Embedded private Location homeLocation;
  @Embedded private Location workLocation;
  ...
}
```

<p><strong>This that won't work!</strong> EclipseLink is going to think the person table has two attributes (workLocation.city and homeLocation.city) that both have the same column name ("city"). We need EclipseLink to have different column names for homeLocation and workLocation. To do that, use <a href="http://docs.oracle.com/javaee/5/api/javax/persistence/AttributeOverride.html">@AttributeOverride</a> (and if our embedded object has a relationship to another entity, use <a href="http://docs.oracle.com/javaee/5/api/javax/persistence/AssociationOverride.html">@AssociationOverride</a>) like this.</p>

```java
@Entity public class Person {
  @Id @GeneratedValue private int personId;
  @Basic private String name;

  @AttributeOverrides({
    @AttributeOverride(name="city", column= @Column(name="homeCity")),
    @AttributeOverride(name="state", column= @Column(name="homeState"))
  })
  @Embedded private Location homeLocation;

  @AttributeOverrides({
    @AttributeOverride(name="city", column= @Column(name="workCity")),
    @AttributeOverride(name="state", column= @Column(name="workState"))
  })
  @Embedded private Location workLocation;
  ...
}
```

<p>You need the <a href="http://docs.oracle.com/javaee/5/api/javax/persistence/AssociationOverrides.html">@AttributeOverrides</a> because Java doesn't like it when you have more than one of the same annotation on the same thing.</p>
