---
layout: post
title: Configure MySQL on AWS t2.micro Linux AMI
date: 2016-01-20 22:04:34.000000000 -08:00
tags:
  - aws
  - errno 12
  - InnoDB
  - MySQL
  - t2.micro
  - Uncategorized

redirect_from:
  - /blog/2016/configure-mysql-on-aws-t2-micro-linux-ami/
---

<p>I moved my blog over to an AWS VM, because I get 12 months of a free <a href="https://aws.amazon.com/ec2/instance-types/">t2.micro</a> instance. Can't beat free hosting for a year, right? And about $10/month after that, on my own private virtual machine. Assumed things were going well, but I came back a few weeks later to find everything had gone to hell. Wordpress was not connecting to the database.</p>
```
[philihp@philihp.com ~]$ sudo service mysqld start
Starting mysqld:                                           [FAILED]
```

<p>In looking at my <code>/var/log/mysqld.log</code> file, I found</p>

```
160120 21:49:58 mysqld_safe Starting mysqld daemon with databases from /var/lib/mysql
160120 21:49:58 [Note] /usr/libexec/mysql55/mysqld (mysqld 5.5.46) starting as process 27540 ...
160120 21:49:58 [Note] Plugin 'FEDERATED' is disabled.
160120 21:49:58 InnoDB: The InnoDB memory heap is disabled
160120 21:49:58 InnoDB: Mutexes and rw_locks use GCC atomic builtins
160120 21:49:58 InnoDB: Compressed tables use zlib 1.2.8
160120 21:49:58 InnoDB: Using Linux native AIO
160120 21:49:58 InnoDB: Initializing buffer pool, size = 128.0M
InnoDB: mmap(137363456 bytes) failed; errno 12
160120 21:49:58 InnoDB: Completed initialization of buffer pool
160120 21:49:58 InnoDB: Fatal error: cannot allocate memory for the buffer pool
160120 21:49:58 [ERROR] Plugin 'InnoDB' init function returned error.
160120 21:49:58 [ERROR] Plugin 'InnoDB' registration as a STORAGE ENGINE failed.
160120 21:49:58 [ERROR] Unknown/unsupported storage engine: InnoDB
160120 21:49:58 [ERROR] Aborting
160120 21:49:58 [Note] /usr/libexec/mysql55/mysqld: Shutdown complete
```

<p>The important thing here is <code>InnoDB: mmap(137363456 bytes) failed; errno 12</code>.</p>
<p>It looks like it couldn't allocate the memory, which makes sense because a t2.micro instance only has a gig of RAM. Ought to be enough for anyone, right? Not for MySQL! The way to fix this is to open up your <code>/etc/my.cnf</code> file, and add a param <code>innodb_buffer_pool_size = 1M</code> (something reasonable). If you haven't made any other changes, it should look similar to this:</p>

```ini
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
# Settings user and group are ignored when systemd is used.
# If you need to run mysqld under a different user or group,
# customize your systemd unit file for mysqld according to the
# instructions in http://fedoraproject.org/wiki/Systemd

innodb_buffer_pool_size = 1M

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

<p>Now if you start MySQL back up, everything should be fine.</p>
```
[philihp@philihp.com ~]$ sudo service mysqld start
Starting mysqld:                                           [  OK  ]
```
