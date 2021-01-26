---
layout: post
title: Installing SAS 9.4 on Ubuntu 14.04
date: 2014-02-19T01:43:28Z
tags:
  - "13.10"
  - "14.04"
  - "9.4"
  - Error
  - install
  - Programming
  - SAS
  - Ubuntu
---

Officially SAS does not support Ubuntu Linux as a platform, in spite of it being the most popular desktop distribution. It will run, but there are two things you need to do:

First, reconfigure Ubuntu not to use dash. The SAS Deployment Wizard will freeze when you first click "Next" during the install if you don't do this.

```bash
$ sudo dpkg-reconfigure dash
```

That being done, you should be able to install SAS Foundation.

Second, SAS requires libjpeg to run. When you first run <code>sas</code>, you'll get this error:

```
ERROR:  BRIDGE FAILURE - ERROR LOADING IMAGE
        MODULE: sasmotifsasvsub HyS SUBSYSTEM: 8 SLOT: 11
```

```
ERROR: Could not load /usr/local/SASHome/SASFoundation/9.4/sasexe/sasmotif (35 images loaded)
ERROR: libjpeg.so.62: cannot open shared object file: No such file or directory
ERROR:  BRIDGE FAILURE - ERROR LOADING IMAGE
        MODULE: sasmotifsasvsub HyS SUBSYSTEM: 8 SLOT: 11
```

Install this by running this command:

```bash
$ sudo apt-get install libjpeg62
```

SAS should now run.

Additionally, while not common, but if you have SAS/Secure installed and want to pull files via https, you'll need to point it at SSL CA certificates. You can kick off SAS with

```
-SSLCALISTLOC="/etc/ssl/certs/ca-certificates.crt"
```

Or just create a file `~/sasv9.cfg` with that in it.

**Update**: This works on 13.10 and 14.04
