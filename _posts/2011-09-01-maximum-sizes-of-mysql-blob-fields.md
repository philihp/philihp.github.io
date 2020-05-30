---
layout: post
title: Maximum sizes of MySQL Blob Fields
date: 2011-09-01 03:36:26.000000000 -07:00
tags:
  - mysql
  - blob
  - size
redirect_from:
  - /blog/2011/maximum-sizes-of-mysql-blob-fields/
---

This is not immediately obvious from the [documentation](http://dev.mysql.com/doc/refman/5.0/en/storage-requirements.html)(, which as it seems is often the case, was written for people who just like to read documentation, and not for people who are looking for answers).

The maximum sizes of the MySQL Blob fields are as follows:

| Type       | What They Say It Needs                 | That Means You Get |
| ---------- | -------------------------------------- | ------------------ |
| TINYBLOB   | L+1 bytes, where L &lt; 2<sup>8</sup>  | 256 bytes          |
| BLOB       | L+2 bytes, where L &lt; 2<sup>16</sup> | 65 kilobytes       |
| MEDIUMBLOB | L+3 bytes, where L &lt; 2<sup>24</sup> | 16 megabytes       |
| LONGBLOB   | L+4 bytes, where L &lt; 2<sup>32</sup> | 4 gigabytes        |

There. Now it's on the Internet and people can find the answer to this question. The world is a better place.
