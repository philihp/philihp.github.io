---
layout: page
title: PGP
permalink: /pgp/
---

My PGP key fingerprint is `427E 0329 39DB 40F2 9D03 D80F 5B64 0B9F 9600 F122`

To receive my PGP key, either run

```
$ gpg --keyserver pgp.mit.edu --recv-key 9600F122
```

or

```
$ curl https://philihp.com/pgp.asc | gpg --import
```

I am also `philihp` on [Keybase](https://keybase.io/philihp), and if you have their CLI client, you can follow and pull my key with

```
keybase follow philihp
keybase pgp pull
```

## Keysigning

I live in San Francisco and will totally sign your key. Then anyone who trusts my key
will also trust your key, and anyone who you trust will also be trusted by them like a pyramid
scheme of trust.

Signing your key will attest that:

- You are known to me by the identity on your UID
- I have verified you are the ower of the email on your UID
- If your key has a photo (no more than 6kb, 240×288) as you.

```
gpg --cert-policy-url https://philihp.com/pgp#keysigning \
    --sign-key FINGERPRINT

gpg --armor --export FINGERPRINT | \
  gpg --armor --encrypt -recipient FINGERPRINT --output FINGERPRINT-signedBy-9600F122.asc
```

I will then send this file to your email to verify that you have access to it. You can then
import this file with

```
gpg --import FINGERPRINT-signedBy-9600F122.asc
```
