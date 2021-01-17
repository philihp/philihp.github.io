---
layout: post
title: Connecting to MySQL with PHP in Apache on OpenBSD
date: 2008-12-30T19:36:00
tags:
  - MySQL
  - OpenBSD
  - PHP
  - Programming
redirect_from:
  - /blog/2008/connecting-to-mysql-with-php-in-apache-on-openbsd.html
---

If you try to connect to MySQL with any scripting language running under Apache on OpenBSD, you're liable to get the error:

`Can't connect to local MySQL server through socket '/var/run/mysql/mysql.sock' (2)`

This can be infuriating, since every setting is probably going to either still be the default setting, or be a correct setting; and the error will persist. The reason for this is simple.

OpenBSD `chroot`'s Apache into `/var/www/`. This means, as far as Apache is concerned, its entire world exists within /var/www, and it can never, ever, break out. In the likely event that a hacker compromises the Apache process into executing code (which is a probable event), any damage will be contained.

So when PHP tries to open /var/run/mysql/mysql.sock, it's _actually_ looking for /var/www/var/run/mysql/mysql.sock, and failing.

The solution to this is given [here](http://www.openbsdsupport.org/e107_CMS.html). It is to update your /etc/rc.local startup script to create a link to the file into the /var/www/ jail during startup.
