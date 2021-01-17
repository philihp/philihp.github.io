---
layout: page
title: PGP
permalink: /pgp/
redirect_from:
  - /pgp.html
  - /blog/pgp/
  - /blog/pgp.html
  - /gpg/
  - /gpg.html
---

My PGP key fingerprint is `427E 0329 39DB 40F2 9D03 D80F 5B64 0B9F 9600 F122`

To receive my PGP key, either run

```bash
gpg --keyserver hkps://pgp.philihp.com --recv-key 427E032939DB40F29D03D80F5B640B9F9600F122
```

or

```bash
curl https://philihp.com/pgp.asc | gpg --import
```

I am also `philihp` on [Keybase](https://keybase.io/philihp), and if you have their CLI client, you can follow and pull my key with

```bash
keybase follow philihp
keybase pgp pull
```

## Keysigning

I live in San Francisco sometimes, and if you find yourself here I will totally
sign your key. Then anyone who trusts my key will also trust your key, and
anyone who you trust will also be trusted by them like a pyramid
scheme of trust.

Signing your key will attest that:

- You are known to me by the identity on your UID
- I have verified you are the ower of the email on your UID
- If your key has a photo (recommended no more than 6kb, 240×288) as you.

```bash
gpg --ask-cert-level \
    --ask-cert-expire \
    --expert \
    --sig-keyserver-url hkps://pgp.philihp.com \
    --sig-policy-url 'https://philihp.com/pgp#policy' \
    --sign-key FINGERPRINT

gpg --export FINGERPRINT | \
  gpg --armor --encrypt --recipient FINGERPRINT \
  > FINGERPRINT-signedBy-9600F122.asc
```

I will then send this file to your email to verify that you have access to it. You can then
import this file with

```
gpg --import FINGERPRINT-signedBy-9600F122.asc
```

You can then send your key signature up to the cloud, if you choose.

## Policy

I will only issue cert levels of level 0x10 (Generic certification), for the points listed here: [`gpg --ask-cert-level` considered harmful](https://debian-administration.org/users/dkg/weblog/98).

My signature will be indefinite if your key expires in less than 2 years.
