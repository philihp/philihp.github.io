---
layout: post
title: "Error: ENOENT when installing Pow on macOS"
date: 2016-06-18 21:55:48.000000000 -07:00
categories: []
tags:
  - chsh
  - fish
  - macos
  - osx
  - pow
redirect_from:
  - /blog/2016/error-enoent-when-installing-pow-on-macos/
---

<p>I kept getting this error when installing <a href="http://pow.cx/">pow</a> on macOS. There are some old <a href="https://github.com/basecamp/pow/issues/297">threads</a> about it, with fixes for previous verisons of OSX prior to El Capitan, but for the most part it seems to be a solved bug.</p>
<pre>philihp@sterling ~$ <b>curl get.pow.cx | sh</b>
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  9039  100  9039    0     0   8763      0  0:00:01  0:00:01 --:--:--  8767
*** Installing Pow 0.5.0...
*** Installing local configuration files...
*** Installing system configuration files as root...
Password: <b>hunter2</b>

/Users/philihp/Library/Application Support/Pow/Versions/0.5.0/lib/command.js:20
throw err;
^
Error: ENOENT, open '/tmp/pow.98645.1466285627293.3185'</pre>

<p>If you're getting this error too, perhaps the solution will be similar to mine?</p>
<p>It turned out that I had at some point changed the default shell of my root user to <code>/usr/local/bin/<a href="https://fishshell.com/">fish</a></code>, then uninstalled fish, and never bothered to set it back. I guess this isn't really a problem most of the time because not much should (hopefully) ever run as root, but it finally surfaced here when trying to install Pow.</p>
<p>My solution was the following:</p>
<ol>
<li>Enable the root user with <code><b>dsenableroot</b></code></li>
<li>If you try to <code><b>sudo su</b></code>, you will get something like <code>su: /usr/local/bin/fish: No such file or directory</code></li>
<li>Change root's shell with <code><b>sudo chsh -s /bin/sh</b></code></li>
<li>Disable the root user with <code><b>dsenableroot -d</b></code></li>
</ol>
<p>Once I did this, installing worked as normal.</p>
<pre>philihp@sterling ~$ <b>curl get.pow.cx | sh</b>
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  9039  100  9039    0     0  17142      0 --:--:-- --:--:-- --:--:-- 17151
*** Installing Pow 0.5.0...
*** Installing local configuration files...
*** Starting the Pow server...
*** Performing self-test...
*** Installed

For troubleshooting instructions, please see the Pow wiki:
https://github.com/basecamp/pow/wiki/Troubleshooting

To uninstall Pow, `curl get.pow.cx/uninstall.sh | sh`</pre>
