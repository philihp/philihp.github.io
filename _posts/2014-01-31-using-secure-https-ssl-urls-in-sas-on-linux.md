---
layout: post
title: Using Secure HTTPS (SSL) URLs in SAS on Linux
date: 2014-01-31T05:00:22Z
tags:
  - "9.4"
  - Error
  - HTTPS
  - OpenSSL
  - Programming
  - SAS
  - SAS/Secure
  - SSL
---

Out of the box SAS 9.4 is not configured to use SSL on Linux x64. If you try to do this, you'll get the error

> `ERROR: SSL Error: Missing CA trust list`

This happens because when SAS gets the SSL certificate from the server, it sees that it's signed by a [Certificate Authority](http://en.wikipedia.org/wiki/Root_certificate), but it doesn't have the SSL certificates from those authorities. Those come with OpenSSL, so get that.

> `sudo apt-get install openssl`

With that installed, the SSL certificates should be in `/etc/ssl/certs`, with `ca-certificates.crt` being an uber-cert that contains all of the other files in one file. To tell SAS to look at that file, add this to `<i>SASHOME</i>/SASFoundation/9.4/sasv9_local.cfg`:

> `-SSLCALISTLOC="/etc/ssl/certs/ca-certificates.crt"`

You'll probably need sudo to modify that file, but you probably had that if you installed OpenSSL. But maybe your admin installed OpenSSL before, but never configured SAS, and is afraid to globally fix this by editing a file in the SAS directory? You can put that config option in `~/sasv9.cfg` instead, creating the file if it doesn't exist. That will only work for you, though, and other users on the system also have to do it.

_NOTE: This was tested on Ubuntu Linux x64 13.10. The location of the cert file will probably differ from distro to distro and version to version. Just look for the SSL CA cert directory, and find the biggest file in it, that's probably the uber-cert._
