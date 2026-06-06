---
title: "Mute George Takei stories from your Facebook News Feed"
date: 2012-05-16
tags:
  - "Facebook"
  - "george"
  - "greasemonkey"
  - "Programming"
  - "takei"
  - "tampermonkey"
author: "Philihp Busby"
---

<p>George Takei (aka Lt. Sulu from Star Trek), I like how you've positioned yourself along with Wil Wheaton as this hybrid nerd celebrity and gay rights activist, and the stories you post on the facebook sometimes make me chuckle, but it's very annoying how you'll post something, then my friends will keep clicking that Share button on it over the course of the next few weeks and I get to see it again and again.</p>
<p>So I wrote this Greasemonkey/Tampermonkey script that will ignore thing shared from you.</p>
<blockquote><p><a href="http://userscripts.org/scripts/review/133516">http://userscripts.org/scripts/review/133516</a></p></blockquote>
<p>It's really simple. Here's the code:</p>
<pre lang="javascript">
$(document).bind('DOMSubtreeModified',function() {
    $('.actorName, .uiAttachmentDetails').each(function() {
        if($(this).text() == 'George Takei')
            $(this).parents('.uiUnifiedStory').hide();
    });
});
</pre>
<p>Basically it finds instances where elements have the class "<code>actorName</code>", and if the content is "<code>George Takei</code>", then it goes up the DOM tree and finds the root element that contains the entire story, and it hides it.</p>
<p>Update: Thanks Norah Riley (<a href="https://twitter.com/#!/super_triangle">@super_triangle</a>) for finding that the class was sometimes "<code>uiAttachmentDetails</code>" as well.</p>
