---
layout: post
title: Using WKD to find PGP keys with GSuite
date: 2020-09-20T22:58:00Z
categories: []
tags:
  - openpgp
  - wkd
  - gnupg
  - gpg
  - discover
  - lookup
  - google
  - gsuite
---

If your domain's email is setup with GSuite, a very convenient, free, and simple WKD service is available with the new `keys.openpgp.org` keyserver and there's little reason not to have it active on your domain to help it gain traction.

Simply set a record for your domain's DNS named `openpgpkey` that CNAME's to `wkd.keys.openpgp.org`

That's it.

For example, I have the email address `philihp@theunhatched.com`, and a client can discover my PGP key automatically with a command like

```bash
❯ gpg --locate-keys --auto-key-locate wkd philihp@theunhatched.com
```

With this domain, you can verify that WKD is properly setup with the command

```bash
❯ dig -t CNAME openpgpkey.theunhatched.com
...
...
...
;; ANSWER SECTION:
openpgpkey.theunhatched.com. 600	IN	CNAME	wkd.keys.openpgp.org.
...
...
...
```

This is an improvement over DNS-based DANE bindings for OpenPGP because it doesn't require each user to have their own DNS record. That might work for personal domains, but this scales for servers where you host email for users that _maybe_ they shouldn't have access to edit your DNS tables.
