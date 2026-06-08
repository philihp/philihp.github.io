---
title: "ii - A True Minimalist's IRC Client"
date: 2010-09-16
tags:
  - "bot"
  - "ii"
  - "Interesting Things"
  - "IRC"
  - "Minimalist"
  - "Unix"
author: "Philihp Busby"
---

<p><a href="http://tools.suckless.org/ii/">ii</a> is probably my favorite IRC client that I don't use. It's written in under 500 lines of C code, and IO is all done through file handles, which writing an IRC bot is as simple as scanning stdin and piping output to a file.</p>
<blockquote><p>ii is a minimalist FIFO and filesystem-based IRC client. It creates an irc directory tree with server, channel and nick name directories. In every directory a FIFO in file and a normal out file is created.</p>
<p>The in file is used to communicate with the servers and the out files contain the server messages. For every channel and every nick name there are related in and out files created. This allows IRC communication from command line and adheres to the Unix philosophy.</p>
<p><a href="http://tools.suckless.org/ii/">http://tools.suckless.org/ii/</a></p></blockquote>
<p>There's not much else to say about it. It does what it needs to do in the simplest way possible. The lack of complexity makes it infallible. Any problems you have with it are almost certainly due to user error, and I wouldn't have it any other way.</p>
