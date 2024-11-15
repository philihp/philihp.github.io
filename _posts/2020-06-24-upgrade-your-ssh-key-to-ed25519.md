---
layout: post
title: Upgrade your SSH key to ed25519
date: 2020-06-24T05:11:00Z
categories: []
tags:
  - ssh
  - ed25519
---

By default, `ssh-keygen` will generate 3072-bit RSA keys, [equivalent](https://safecurves.cr.yp.to/rho.html) to a 128-bit symmetric key, which people smarter than me say is sufficient.

One of these keys might look like this:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCo1/2nxzBea7BkBJmbPUO3fW7HYiUIS+85PuycJ36z
iz/TP44IBkCFyFZxBanGDWfSJDL/L2cWJ21c3S9iRvDx2skKG7ZUHO04bWXeFcYoVhUKNrusj2bipy3N
Q+uIDKLalYhoZvQA1qdrnO91V4GIcmXb94NTaOofT3TUVXeFyOuMHygMM86eUUppFy/j6B6lpIx52S3L
utB4xV3Istgi+9hogkwRpcEOcQWXkwQIMWk1hJrNVw3u17Y0CLv1c1AOGhz1bdpRrnc20nOH3OWj6VW1
Qcd9VgVQx+JmtwBB4sUpm79shlv8tt0K/JxQ19zc9R/DHD2MXCPuHP9KDZ8+hpJWzyGAo1Q6/nPhHt6g
zWAPsOw20EZ0XO9l2onCknnfcOQJdyYoW5Klqa2ZgGpfuWo2yK2cXaAv2rZgrw56CCeQbbLgNLT1Jsbn
Q7VsILJBCg/zr+VoEbYFiGhixWWdTzqurcaozsoRcYzlMUV6SZOi3dCvTeLcOhyXKnieYJU=
```

As a binary embedded in a QR code, this could look like this:

[![](/assets/id_rsa3096.png)](/assets/id_rsa3096.pub)

If sufficient is good enough for you, then there is no reason to read this post, but if you want to be a special snowflake, then upgrade to an ed25519 key!

## Enter ed25519

[Ed25519](https://ed25519.cr.yp.to/) keys are really short because instead of your key being two prime factors, you can just use any random noise as a private key, and generate your corresponding public key from that. Generate them like this:

```bash
ssh-keygen -t ed25519
```

This creates a really slim key, so in all of your `authorized_keys` files, you'll just look like

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO/hBOfgryiHaeNkhjwehgKWIyTgNAvHbPiNPCrCyWd5
```

One line! So compact! Turn this into a QR code and it looks like

[![](/assets/id_ed25519.png)](/assets/id_ed25519.pub)

There are absolutely valid reasons for you to do this for security reasons, but none of these reasons is urgent. The thing that's urgent for right now is vanity. Who wants a large 4096-bit key when you can have a key 10% that size, and perhaps more secure? I'll tell you who. You. You want that.

These are also compatible with [GnuPG](https://www.gniibe.org/memo/software/gpg/keygen-25519.html)
