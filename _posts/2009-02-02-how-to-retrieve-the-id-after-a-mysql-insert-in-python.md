---
layout: post
title: How to retrieve the ID after a MySQL Insert in Python
date: 2009-02-02 10:02:40.000000000 -08:00
tags:
  - How To
  - MySQL
  - MySQLdb
  - Programming
  - Python
redirect_from:
  - /blog/2009/how-to-retrieve-the-id-after-a-mysql-insert-in-python/
---

When you have an [auto_increment](http://dev.mysql.com/doc/refman/5.0/en/example-auto-increment.html) field on a table, and you're doing a batch import of new data, you often want to insert a row, then insert more rows that have a foreign key referencing the first row. For example, you want to insert a COMPANY entity, then insert a few dozen PERSON entities under that company. Assuming you have no unique and not-null fields on the COMPANY entity (if company_name were unique and not-null, then you could just issue a select immediately after inserting to get its ID), and assuming you want a thread-safe solution (you could just select for the highest ID in the table immediately after inserting, but since MySQL is by default not transaction-safe, another thread could come in and insert another company right after you insert and before your select), you simply <i>need</i> to have `mysql_insert_id()`.

The MySQLdb [documentation](http://mysql-python.sourceforge.net/MySQLdb.html) mentions `conn.insert_id()`, however this appears to have been deprecated, maybe? This really should be on the cursor object anyway. And behold! There <i>is</i> a `lastrowid` on it! It's just a little bit undocumented:

```python
>>> import MySQLdb
>>> connection = MySQLdb.connect(<i>...</i>)
>>> cursor = connection.cursor()
>>> cursor.execute("INSERT INTO PERSON (name) VALUES ('Philihp')")
1L
>>> print cursor.lastrowid
42
```
