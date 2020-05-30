---
layout: post
title: Postgres 10 to 11 upgrade
date: 2019-01-16 10:44:00.000000000 -07:00
categories: []
tags:
  - postgres
  - macos
  - brew
---

After doing a `brew upgrade postgresql` which updated my computer's
Postgres version from 10 to 11, I attempted to do an upgrade of my
database from 10 to 11, which would fail with the following error:

```
$ brew postgresql-upgrade-database
...
Performing Consistency Checks
-----------------------------
Checking cluster versions                                   ok

The source cluster was not shut down cleanly.
Failure, exiting
Error: Upgrading postgresql data from 10 to 11 failed!
==> Removing empty postgresql initdb database...
==> Moving postgresql data back from /usr/local/var/postgres.old to /usr/local/var/postgres...
==> Successfully started `postgresql` (label: homebrew.mxcl.postgresql)
Error: Failure while executing; `/usr/local/opt/postgresql/bin/pg_upgrade -r -b /usr/local/Cellar/postgresql@10/10.6_1/bin -B /usr/local/opt/postgresql/bin -d /usr/local/var/postgres.old -D /usr/local/var/postgres -j 8` exited with 1.
```

This occured because I had shutdown my machine ungracefully, and my database was in an inconsistent state. To fix this, I needed to start Postgres 10 again. To do that, first do `brew install postgresql@10` (this should have already been done by the previous upgrade database command). Then startup postgresql@10, but using the normal data directory, and ^C to kill it gracefully.

```
$ /usr/local/opt/postgresql@10/bin/postgres -D /usr/local/var/postgres

2019-01-16 10:15:20.725 PST [1202] LOG:  listening on IPv6 address "::1", port 5432
2019-01-16 10:15:20.725 PST [1202] LOG:  listening on IPv4 address "127.0.0.1", port 5432
2019-01-16 10:15:20.726 PST [1202] LOG:  listening on Unix socket "/tmp/.s.PGSQL.5432"
2019-01-16 10:15:25.341 PST [1287] LOG:  database system was interrupted; last known up at 2019-01-08 18:18:11 PST
2019-01-16 10:15:29.568 PST [1287] LOG:  database system was not properly shut down; automatic recovery in progress
2019-01-16 10:15:29.732 PST [1287] LOG:  redo starts at 0/A7EA01B0
2019-01-16 10:15:29.732 PST [1287] LOG:  invalid record length at 0/A7EA3498: wanted 24, got 0
2019-01-16 10:15:29.732 PST [1287] LOG:  redo done at 0/A7EA3460
2019-01-16 10:15:29.762 PST [1202] LOG:  database system is ready to accept connections
2019-01-16 10:18:22.752 PST [1202] LOG:  received smart shutdown request
2019-01-16 10:18:22.931 PST [1202] LOG:  worker process: logical replication launcher (PID 1307) exited with exit code 1
2019-01-16 10:18:22.947 PST [1301] LOG:  shutting down
2019-01-16 10:18:23.238 PST [1202] LOG:  database system is shut down
```

Now you should be able to run the upgrade.

```
$ brew postgresql-upgrade-database

...
Performing Consistency Checks
-----------------------------
Checking cluster versions                                   ok
Checking database user is the install user                  ok
Checking database connection settings                       ok
Checking for prepared transactions                          ok

...

Sync data directory to disk                                 ok
Creating script to analyze new cluster                      ok
Creating script to delete old cluster                       ok

Upgrade Complete
```

Also, now you can `brew uninstall postgres@10` and remove the old database `/usr/local/var/postgres@10/` to save a few hundred megs of space (or more if you had a lot of data).
