---
layout: post
title: Please stop creating links with target="_new".
date: 2011-11-16T23:33:26Z
tags:
  - _blank
  - _new
  - HTML
  - link
  - new window
  - Programming
  - target
---

Just stop. This is wrong; instead, use this:

> `target="_blank"`

I don't know who started these nasty rumors that "\_new" would open up in a new browser. As far back as I can tell, no browser has ever recognized "\_new".

The whole point of the `target` dates back to when browsers used frames to split up your browser. If you had a link in a sidebar on the left, and you wanted that link to open up in the main frame to the right, you would specify "main" as the name of that frame in your frameset page, and target="main" in your links on the sidebar. When the user would click on a link in the sidebar, the browser would say "hmm, I'm supposed to open this up in the 'main' frame, do I have one named that?". If it didn't, it would open up the link in a new window, and give that window the name of the target of the link. This is what would happen with target="\_new"; a new browser would open up with a name of "\_new".

The problem is this if you click on this first link, then read it and go "oh that's interesting" and click on some links in it to goto further pages on it, everything seems fine. But then if you click this second link below, and then the third link, they open up in the same browser!

- [Link 1](http://en.wikipedia.org/wiki/Hoag's_Object) target="\_new"
- [Link 2](http://en.wikipedia.org/wiki/Vlad_III_Dracula) target="\_new"
- [Link 3](<http://en.wikipedia.org/wiki/Jack_(playing_card)#History>) target="\_new"

If only they had a target of "\_blank", they would all open up in a new browser every time.

- [">Link 1](http://en.wikipedia.org/wiki/Hoag's_Object) target="\_blank"
- [">Link 2](http://en.wikipedia.org/wiki/Vlad_III_Dracula) target="\_blank"
- [">Link 3](<http://en.wikipedia.org/wiki/Jack_(playing_card)#History>) target="\_blank"

It's a simple fix. Just stop using target="\_new".

> You keep using that word. I do not think it means what you think it means. - [http://www.imdb.com/title/tt0093779/quotes?qt=qt0482717" target="\_blank">Inigo Montoya</a>

Or just stop opening links in new browsers all together; it has been [http://www.useit.com/alertbox/990530.html">considered bad usability</a> for over a decade now. The user will open your links up in a new window if they want to.
