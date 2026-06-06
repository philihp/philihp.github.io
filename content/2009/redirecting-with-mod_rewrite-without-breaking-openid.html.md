---
title: "Redirecting with mod_rewrite without breaking OpenID"
date: 2009-02-27
tags:
  - "mod_rewrite"
  - "OpenID"
  - "phpMyID"
  - "Programming"
author: "Philihp Busby"
---

<p>On philihp.com, I redirect the root address philihp.com to philihp.com/blog. I do this with mod_rewrite, since it's much faster to do an HTTP Location header based redirect than to use an HTML meta tag redirect. I encountered a problem with this, though.</p>
<p>I want to be able to authenticate with the identifier "philihp.com". Not "openid.philihp.com", not "philihp.com/openid", just simply "philihp.com", and I have it all setup using phpMyID to host locally, which is good. But rather than put all the server machinery for authenticating at my root level, I like to have it at "philihp.com/openid" (or elsewhere), and out of the way. OpenID has facility for doing this, since it's almost always done; when a browser visits philihp.com, in the <code>HEAD</code> tags of the HTML, there's the following:</p>
<pre>&lt;link rel="openid.server" href="<i>http://philihp.com/openid/</i>" /&gt;
&lt;link rel="openid.delegate" href="<i>http://philihp.com/</i>" /&gt;
</pre>
<p>Where the <code>openid.server</code> specifies where the machinery is for taking care of the authentication, and the <code>openid.delegate</code> specifies what the claimed identifier is. What happens when you go to somewhere like <a href="http://twitterfeed.com">twitterfeed.com</a>, when you try to authenticate there the server itself goes to the URL you give it, looks at the <code>HEAD</code> tags of the HTML it sees there, and forwards the end user to the <code>openid.server</code> specified. The problem I had is that when the server goes to philihp.com, it's being redirected from mod_rewrite to blog/ because of <a href="/blog/2009/01/redirect-root-path-to-blog-directory/">this thing</a>. This is bad, because it causes my claimed identifier to be "philihp.com/blog/" instead of just "philihp.com".</p>
<p>I wasn't the first person to have this problem, though. <a href="http://qedx.com/blog/redirecting-without-breaking-openid/2009/01/07/">Haris bin Ali</a> and <a href="http://willnorris.com/2008/12/challenges-in-changing-my-openid">Will Norris</a> found a solution with PHP that checks the HTTP headers and redirects based on them. Below these have been adapted to RewriteCond rules, which would get evaluated before PHP or any other platform your site runs on (so long as it's still Apache).</p>
<pre>RewriteCond %{HTTP_USER_AGENT} !openid [NC]
RewriteCond %{HTTP_USER_AGENT} !^$
RewriteCond %{HTTP_ACCEPT} !application/xrds+xml [NC]
RewriteRule ^$ /blog/ [R,L]</pre>
<p>These say "Redirect empty requests (requests for root) to /blog/, unless the User-Agent header has "openid" in it, or is blank, or the Accept header contains "application/xrds+xml""; which are all going to be characteristic of a request coming from an OpenID consumer, and not from a normal browser.</p>
