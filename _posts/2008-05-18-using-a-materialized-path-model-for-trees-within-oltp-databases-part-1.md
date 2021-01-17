---
layout: post
title: Using a Materialized Path Model for Trees within OLTP Databases (part 1)
date: 2008-05-18T08:24:00Z
tags:
  - Programming
  - SQL
---

Databases are very very good at storing tabular, dimensional data; and in a world where everything is a spreadsheet (your finance department), this works very well. Often, though, there's a need for an application to store and deal with a tree of data; such as in classification systems or management structures. The [Library of Congress](http://en.wikipedia.org/wiki/Library_of_Congress_Classification), the [Dewey Decimal System](http://en.wikipedia.org/wiki/Dewey_Decimal_Classification), and [NAICS](http://www.census.gov/epcd/naics02/naicod02.htm) all come to mind. Anyone who's ever been working with their company's employee data has certainly come across the management hierarchy. In each of these, you've got a tree of nodes, each node (except the top; the tree root) having at most one parent, and each node (except those on the bottom; the leaves) having any number of children.

```
          [node]
         /      \
     [node]    [node]
      /  \         \
 [node]  [node]   [node]
                      \
                     [node]
```

In a properly normalized [OLTP](http://en.wikipedia.org/wiki/OLTP) database, what people usually do is create a table structure where each node only knows his parent. This satisfies the requirement of database normalization to have each fact/idea in one and only one location so that there can't possibly be a conflict (aside: this doesn't guarantee that there can't be conflicts. Node A could say node B is its parent, and node B could say node A is its parent).

This is called the **Adjacency Model**, since it is clear when two records are adjacent siblings; they share the same parent.

The way this looks as far as table schema would be

```
+--------------+
| NODE         | <---.
+--------------+     |
| node_id      |     |
| parent_id    | ----'
| node_data... |
+--------------+
```

The other day I was asked how one could quickly query the database the question "How do I find all of the direct and indirect children of a node?"

Direct children are simple...

```sql
SELECT *
  FROM node
  WHERE parent_id = ?
```

Children of children of a node is also simple...

```sql
SELECT *
  FROM node
  WHERE parent_id = ?
    OR parent_id in (
        SELECT node_id
        FROM node
        WHERE parent_id = ?)
```

But this gets out of hand pretty quickly, and it becomes obvious we won't be able to have a single, simple, fast query that gives ALL children of a node, no matter how far down their ancestry.

[**Enter the Materialized Path Model**](http://www.amazon.com/exec/obidos/ASIN/0596008945?tag=philihp-20)

In a Materialized Path model, each row of your table knows its entire ancestry. It's a little like if every file on your file system knew its entire path, rather than just the folder it was in.

Probably the best way to describe it is by example. Say we had this tree:

```
             0
           / | \
          1  2  3
         /  / \
        4  5   6
              /|\
             7 8 9
```

In an adjacency model, our table looks like:

```
+---------+-----------+
| node_id | parent_id |
+---------+-----------+
| 0       | .         |
| 1       | 0         |
| 2       | 0         |
| 3       | 0         |
| 4       | 1         |
| 5       | 2         |
| 6       | 2         |
| 7       | 6         |
| 8       | 6         |
| 9       | 6         |
+---------+-----------+
```

However in a materialized path model, we would store this as

```
+---------+-------+
| node_id | path  |
+---------+-------+
| 0       |       |
| 1       | 1     |
| 2       | 2     |
| 3       | 3     |
| 4       | 1.4   |
| 5       | 2.5   |
| 6       | 2.6   |
| 7       | 2.6.7 |
| 8       | 2.6.8 |
| 9       | 2.6.9 |
+---------+-------+
```

In order to ask the database "which nodes are children of _x_" you can query with

```sql
SELECT *
  FROM node
  WHERE path LIKE
    (SELECT path
       FROM node
       WHERE node_id = x)||'%'
```

In some languages, the "begins with" operation is optimized. MySQL can use regular expressions. SAS has the `=:` operator.

This model lends itself to other nice things; finding the depth of a node can be calculated on the number of dot delimiters in the path.

The Materialized Path model works very well as opposed to the Adjacency model when the root node, and nodes with deep ancestry rarely change; which is usually the case in classification schemes (base categories tend to be the established ones) and company org hierarchies (upper level executive managers tend to be senior).

We can do a little bit better with a materialized path model, though... More in Part 2.

<!--
part 2:
standardize the length of each element in the path for depth calc
no need for delimiters now<

part 3:
disconnect using the ID, instead use a letter
letters don't have to be unique to the table, just the last element has to be unique
  for all the direct reports of that record's manager
by using alphanumerics, support up to 62 direct reports
-->
