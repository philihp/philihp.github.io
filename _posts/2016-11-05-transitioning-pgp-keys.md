---
layout: post
title: Transitioning PGP Keys
date: 2016-11-05 08:15:07.000000000 -07:00
type: post
parent_id: "0"
published: true
password: ""
status: publish
categories: []
redirect_from:
  - /blog/2016/transitioning-pgp-keys/
---

```
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA1,SHA512</p>

2016-11-06 05:25:00 +0000

I am replacing my old DSA-1024 key with a stronger RSA-4096 key. The primary
motivation is to store my key on a Yubikey Nano which doesn't support DSA,
however there is a possibility that the old key has been compromised. Although
I don't have any evidence to suspect this, I certainly haven't been as careful
over the years as I could have.

The old key was:

sec 1024D/1209F481 2010-05-24
Key fingerprint = 093B A359 D87C E901 9AAE ACDF BF99 B090 1209 F481

And the new key is:

sec 4096R/5B640B9F9600F122 2016-02-29
Key fingerprint = 427E 0329 39DB 40F2 9D03 D80F 5B64 0B9F 9600 F122

To fetch the full key from a public key server, you can simply do:

gpg --keyserver pgp.mit.edu --recv-key 5B640B9F9600F122

If you already know my old key, you can now verify that the new key is
signed by the old one:

gpg --check-sigs 5B640B9F9600F122

If you don't already know my old key, or you just want to be double
extra paranoid, you can check the fingerprint against the one above:

gpg --fingerprint 5B640B9F9600F122

If you are satisfied that you've got the right key, and the UIDs match
what you expect, I'd appreciate it if you would sign my key:

gpg --sign-key 5B640B9F9600F122

Lastly, if you could upload these signatures, i would appreciate it.
You can either send me an e-mail with the new signatures (if you have
a functional MTA on your system):

gpg --armor --export 5B640B9F9600F122 | \
mail -s 'OpenPGP Signatures' philihp+signature@gmail.com

Or you can just upload the signatures to a public keyserver directly:

gpg --keyserver pgp.mit.edu --send-key 5B640B9F9600F122

Please let me know if there is any trouble, and sorry for the
inconvenience.

Jolan'tru,
Philihp Busby
-----BEGIN PGP SIGNATURE-----
Comment: http://keybase.io/philihp

iEYEARECAAYFAlgev3IACgkQv5mwkBIJ9IFQ0wCfThA3ak97QRVkgCDuFPDKNZfg
lJEAn0ANZrQsLZU2eBatwqXp89V2YJwViQIcBAEBCgAGBQJYHr9yAAoJEFtkC5+W
APEiqJgP/jUuel2Wf9/uf5AnghP7Qm55niGxCJKGc2+QYUUyzyKKTddcZNkfAqLe
Z4mtMelH2uVppU9KxLfe8aQCfXmY6iijJh2Hqreq0/T/F5pEzCQc5J5d/AcEI4PL
Lb3U8X1nIay7YeFtfqKHSFe06AbK1Bn6viMNHP4mVLqkw5S8A3+umFsTyq7ekfuq
sMZx1uppcjVrxAi4fbHQ5bYWf50aH7C+g2OISFOpTmbdgH7M3B+dTNuJ4TJrvvh6
4NPPglcnHlcBDUVZVFdL4f26Ig7OhGdvoCnBPE+vET8+D9qHpAdsgho5iMFpgp3x
erOQYFm4DvWx+HqdplhnWNpRH9PjjxOKy+14bCGbAurgytTJlACJReuQuVDW1yzU
y3xvKfMPheU6x4o9Px1X6ldhKn/lXwUW7z0wJxxzoCS8rveRF6pUwZhRWjaP5JuX
INIVxByiY9JLXeuImKpiV4UQ0IvYK7McKN9TiVpIYe9YRYn7I6miYf+BPTZmtBOr
qz72V8HwPjrrF+24QANL3wYIIsV2vVL2Lm60TkKt6qfkDXgO841pWGHY9IrPaSVA
S3YF5n/b/rFYx/k8AD7Na8uWS61d996pSn0vBkv8j6ReKlGuuKIxa60yTrNpnlmV
m22Y/8DtgN07K5zulcvD+KcZecPS47TlxspCPpQwzu1bsaCRBScQ
=DWIc
-----END PGP SIGNATURE-----
```

<p><a href="http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar1.pdf">Why?</a></p>
