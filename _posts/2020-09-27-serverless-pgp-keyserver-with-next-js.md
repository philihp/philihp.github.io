---
layout: post
title: Building a Serverless PGP Keyserver with Next.js
date: 2020-09-27T10:15:00Z
categories: []
tags:
  - pgp
  - gpg
  - gnupg
  - keyserver
  - hkps
---

The PGP keyservers in the SKS-Keyservers pool has been dwindling. What used to be in the hundreds now regularly dips below 20. The HKPS keyserver pool is just one server. My old entry in the pool is still there so I figured I'd do something with that. I also annotated key signatures with my keyserver for a while, so there's a chance someone's client might try to say hi. This isn't entirely useless; just mostly.

## Introducing [pgp.philihp.com](https://pgp.philihp.com)

The HKP protocol is really just a standardized interface of GET parameters for the path `/pks/lookup`. This is well documented at [keys.openpgp.org](https://keys.openpgp.org/about/api). At a minimum, if you know the ID of the key you're searching for, you can ask your keyserver for it with

```bash
❯ gpg --keyserver hkps://pgp.philihp.com --recv-key 5B640B9F9600F122
```

HKPS is just HKP over SSL, simillar to HTTP and HTTPS. Since I deplyed this Next.js app via Vercel, it will insist people use HTTPS, so you can't just do `--keyserver pgp.philihp.com`, because this will try to query over HTTP.

Since my keyserver always insists on sending you my key, if you query it with any other key ID, a key will come back and GnuPG will reject it.

```bash
❯ gpg --keyserver hkps://pgp.philihp.com --recv-key CE90A31451DE4AD7
gpg: key 0x5B640B9F9600F122: rejected by import screener
gpg: Total number processed: 1
```

¯\\\_(ツ)\_/¯

The source code is available on [Github](https://github.com/philihp/pgp.philihp.com)
