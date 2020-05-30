---
layout: post
title: How To Save Struts Messages After a Redirect
date: 2012-12-18 10:34:41.000000000 -08:00
tags:
  - actionerror
  - actionmessage
  - errors
  - How To
  - messages
  - Programming
  - redirect
  - save
  - session
  - Struts
redirect_from:
  - /blog/2012/how-to-save-struts-messages-after-a-redirect/
---

If you've got an Action in Struts 1 that leaves an error or message for the
view, it does it somewhere in the class like this:

```java
ActionMessages messages = getMessages(request);
messages.add(ActionMessages.GLOBAL_MESSAGE, new ActionMessage("message.detail", "Normality has been restored."));
saveMessages(request, messages);
```

However if your Action later selects an ActionForward that redirects (possibly
unbeknownst to the Action, since that is configured elsewhere), the Controller
will redirect the browser to that new location and Struts will see that
redirected call as an entirely new request, having lost anything in the
request attributes (such as the message you just saved).

There are some [other](http://struts.1045723.n5.nabble.com/Showing-messages-after-a-redirect-td3481980.html)
ways to do it, but here's a really simple way to do it:

```java
saveMessages(request.getSession(), messages);
```

Once they're displayed in the view once they will automatically be removed
from the session. In this fashion, it behaves like a [Flash](http://mkblog.exadel.com/2010/07/learning-jsf2-using-flash-scope/)
scoped variable in JSF, except you can be sure it's displayed even if the next
request fails, which is probably a good thing.
