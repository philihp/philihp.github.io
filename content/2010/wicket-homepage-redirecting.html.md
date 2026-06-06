---
title: "Wicket Homepage Redirecting"
date: 2010-08-31
tags:
  - "Framework"
  - "Java"
  - "Programming"
  - "Web"
  - "Wicket"
author: "Philihp Busby"
---

<p>With the <a href="http://wicket.apache.org/">Wicket</a> Java Web framework where a lot of magic happens behind the scenes, and almost no XML needs to be configured. Most of it is done with Java. It has a lot of pretty cool features. I just came across this one.</p>
<p>In the init setup of your class that extends <a href="http://wicket.apache.org/apidocs/1.4/org/apache/wicket/protocol/http/WebApplication.html">WebApplication</a>, you can "mount" your pages at paths, like this:</p>
<pre name="code" class="java">
@Override
protected void init() {
	super.init();
	mountBookmarkablePage("/search", SearchPage.class);
}
</pre>
<p>So when you goto http://somewhere.com/somecontext/search, it gives you the SearchPage class.</p>
<p>You can also specify a HomePage index, like this:</p>
<pre name="code" class="java">
public Class<? extends Page> getHomePage() {
	return IndexPage.class;
}
</pre>
<p>Then when you goto http://somewhere.com/somecontext/, it gives you the IndexPage class.</p>
<p>The cool subtle thing here is what happens when you do them both; i.e. you mount SearchPage to /search, and you override getHomePage to return SearchPage.class. Do this, and when you goto http://somewhere.com/somecontext/, it will redirect to http://somewhere.com/somecontext/search!</p>
