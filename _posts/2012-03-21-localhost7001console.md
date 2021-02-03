---
title: localhost:7001/console
date: 2012-03-21T22:01:25Z
tags:
  - "7001"
  - console
  - Internet Explorer
  - localhost
  - Shameless
  - Weblogic
---

The second most annoying thing about Internet Explorer 9 is that if you type "localhost:7001/console" into the address bar, is that it thinks this is a search string and not a URL. It is, in fact, the address of the administration console of Weblogic running on the default port of the current machine.

Instead of treating it as a URL, it searches for "localhost:7001/console" on the default search engine. So I figured I would create a blog post about it and see if I can steal some of that traffic. Then once I'm indexed, I'll create an HTTP Redirect to "http://localhost:7001/console" and fix the problem.

Note: The first most annoying thing is that [Chrome Frame](http://code.google.com/chrome/chromeframe/) is not installed by default.
