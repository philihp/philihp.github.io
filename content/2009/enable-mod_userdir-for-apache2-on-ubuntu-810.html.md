---
title: "Enable mod_userdir for Apache2 on Ubuntu 8.10"
date: 2009-01-30
tags:
  - "Apache"
  - "How To"
  - "HTTP"
  - "mod_userdir"
  - "Programming"
  - "Ubuntu"
author: "Philihp Busby"
---

<p>To enable mod_userdir, so your server's Apache httpd server will respond to requests like "http://www.yourserver.com/~someuser", use the a2enmod command, then restart Apache to pickup the change:</p>
<p><code>sudo a2enmod userdir<br />
sudo /etc/init.d/apache2 restart</code></p>
