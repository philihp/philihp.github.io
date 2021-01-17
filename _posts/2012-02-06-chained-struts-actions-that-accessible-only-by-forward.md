---
layout: post
title: Chained Struts Actions Accessible Only by Forward
date: 2012-02-06T05:40:05
tags:
  - Action
  - Forward
  - Fragment
  - Hack
  - Java
  - Programming
  - Struts
  - Struts 1.3
redirect_from:
  - /blog/2012/chained-struts-actions-accessible-only-by-forward.html
  - /blog/2012/chained-struts-actions-that-accessible-only-by-forward.html
---

So I just stumbled into doing this little trick. It may go against some pattern, or best practice, but I'm sure there's a use for it somewhere.

In [Struts 1.3](http://struts.apache.org/1.3.10/) (and probably any Struts 1.x), it is sometimes useful to have a request chain across multiple Action classes, maybe to break them up into more manageable sections. But maybe you don't want step-2 of a multi-Action process be accessible externally. If you configure your Actions like this in your `struts-config.xml`, you can do just that.

```xml
<action path="/refresh" type="com.philihp.action.RefreshPartOne">
  <forward name="default" path="/refresh#2.do" />
</action>
<action path="/refresh#2" type="com.philihp.action.RefreshPartTwo">
  <forward name="default" path="/" redirect="true" />
</action>
```

To trigger it, have the user goto <code>/refresh.do</code>. Struts will call
RefreshPartOne.execute(), and assuming it returns the default ActionForward,
it will call RefreshPartTwo.execute().

If the user tries to call <code>/refresh#2.do</code>, they will get an error.
The browser will strip out the
[fragment identifier](http://en.wikipedia.org/wiki/Fragment_identifier)
from the URL and tell the server it wants to see /refresh, which doesn't
exist. It may be possible to carefully craft a request to the server though,
and it's up to your container (e.g. Tomcat, Glassfish) to strip out the
fragment. Behavior is probably undefined because
[RFC 1738](http://www.ietf.org/rfc/rfc1738.txt) says the
'`#`' is unsafe and should never be sent in a URL. So test it out
if you're really curious.
