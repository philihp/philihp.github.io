---
layout: post
title: Gmail with Mutt, GPG, Pass, and your Yubikey
date: 2020-06-13T00:45:30Z
categories: []
tags:
  - mutt
  - gmail
  - passwordstore
  - pass
  - gpg
  - yubikey
---

I use Mutt for most of my gmail needs for a number of reasons, including spam is usually HTML-only, while (actually important) emails written by humans always have a readable text-only format. My hubris also assures me that I'm reasonably insulated from [email worms](https://en.wikipedia.org/wiki/Category:Email_worms).

Configuring Mutt out of the box requires you to put your plaintext password in a `~/.muttrc` file, which is asking for all sorts of problems. The following is how I use a hardware Yubikey to protect my Gmail password, and then sync that password across machines.

## Yubikey setup with GnuPG

If you don't already have one, get a Yubikey. Here are some options:

- [Yubikey 5C Nano](https://amzn.to/3hqP4Iw) - USB-C recommended
- [Yubikey 5C](https://amzn.to/2UCc0Lq) - USB-C
- [Yubikey 5 Nano](https://amzn.to/2MQFf8Z) - USB-A, for older macbooks.
- [Yubikey 5 NFC](https://amzn.to/30EwOW7) - USB-A + NFC

While waiting for this to arrive, you can continue with a GPG key on your hard drive; just make sure you protect it with a passphrase, which GPG will strongly encourage, because otherwise there's no point.

### Migrating your existing key to the card

If you've created your key already, migrate it to the card. Most people just have one master key, and one encryption subkey; if you run `gpg --list-secret-keys`, you may see something like this:

```
/Users/philihp/.gnupg/pubring.kbx
---------------------------------
sec   rsa4096/0x5B640B9F9600F122 2016-02-29 [SC] [expires: 2021-02-07]
      427E032939DB40F29D03D80F5B640B9F9600F122
uid                   [ultimate] Philihp Busby <philihp@gmail.com>
ssb   rsa4096/0x0D86EF2BF0DA842E 2016-02-29 [E] [expires: 2021-02-07]
```

- On the left the `sec` means "i have the secret key"
- `ssb` means "i have the secret subkey".
- If either of these says `pub` or `sub`, it means "i just have the public key", and that's a problem.
- The third column is the date the key was created, which is relevant for `[E]` subkeys.

In the brackets in the 4th column, you can see `[SC]` for the master key meaning it is meant for the "Signing" usage and the "Certification" usage, and `[E]` for the subkey meaning it is meant for "Encryption". I think it's not a bad idea to create another subkey for "Authentication" or [add that usage to an existing key](https://dev.gnupg.org/T3970), but important: , but there are two important points:

- You can have any number of `S` signing keys or `A` authentication keys.
- You should **only have one key with the `E` usage**. When a message is encrypted, GPG uses the newest `E` subkey, i.e. the one with the last creation.

To move these to your Yubikey, run the command

```
gpg --edit-key 5B640B9F9600F122
```

where `5B640B9F9600F122` is your key... it's actually [my key](/pgp); I don't know your key. You could tell me it, though, I'd love to know if this helped you. So if you run that, you'll be dropped into another console

```
gpg (GnuPG) 2.2.20; Copyright (C) 2020 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Secret key is available.

...
...

gpg>
```

Useful commands here: `help`, for common commands; `list` to show your key, `key N`, to select a subkey where N is the index number of the key starting with 1, and `keytocard` to move the selected key to the card.

!> If you don't have a key selected, `keytocard` will move the master key.

1. `keytocard` without a key selected to move your master key into the Signing slot of your Yubikey.
2. `key 1` and `keytocard` to move your encryption subkey into the Encryption slot of your Yubikey
3. If you have another subkey with Authentication, or you added that usage to your first key using `change-usage`, move this into the Authentication slot of your Yubikey.
4. `save` to save your key.

Now running

```bash
gpg --list-secret-keys
```

Should display something like

```
sec>  rsa4096/0x5B640B9F9600F122 2016-02-29 [SC] [expires: 2021-02-07]
      427E032939DB40F29D03D80F5B640B9F9600F122
      Card serial no. = 0006 09123456
uid                   [ultimate] Philihp Busby <philihp@gmail.com>
ssb>  rsa4096/0x0D86EF2BF0DA842E 2016-02-29 [E] [expires: 2021-02-07]
ssb>  rsa4096/0xFD8194C54A63DBD5 2020-06-13 [A] [expires: 2021-02-07]
```

Some things that changed here:

- The `sec` turned into `sec>`, meaning "I know where to get the private key"
- The `ssb` turned into `ssb>`, similarly.
- There's a line with `Card serial no. = 0006 09123456` meaning "It's on a smart card
  with this serial number.
- These are called [Stub Keys](https://wiki.debian.org/GnuPG/StubKeys).
- There's a second subkey (which I added but did not document above, this is optional but useful if you want to use `gpg-agent` as a replacement for `ssh-agent`)

Similarly, if you run

```
gpg --card-status
```

You should see something like

```
❯ gpg --card-status
Reader ...........: Yubico YubiKey FIDO CCID
Application ID ...: D2760001240102010006091234560000
Application type .: OpenPGP
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: 09123456
Name of cardholder: Philihp Busby
Language prefs ...: en
Salutation .......:
URL of public key : https://philihp.com/pgp.asc
Login data .......: philihp
Signature PIN ....: forced
Key attributes ...: rsa4096 rsa4096 rsa4096
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 42
Signature key ....: 427E 0329 39DB 40F2 9D03  D80F 5B64 0B9F 9600 F122
      created ....: 2016-02-29 07:34:57
Encryption key....: C54A 7C6F 8B38 A89F 3102  4BAB 0D86 EF2B F0DA 842E
      created ....: 2016-02-29 07:34:57
Authentication key: D5CB FB11 287E 0B3A 287D  F591 FD81 94C5 4A63 DBD5
      created ....: 2020-06-13 04:53:06
General key info..: pub  rsa4096/0x5B640B9F9600F122 2016-02-29 Philihp Busby <philihp@gmail.com>
sec>  rsa4096/0x5B640B9F9600F122  created: 2016-02-29  expires: 2021-06-12
                                  card-no: 0006 09123456
ssb>  rsa4096/0x0D86EF2BF0DA842E  created: 2016-02-29  expires: 2021-02-07
                                  card-no: 0006 09123456
ssb>  rsa4096/0xFD8194C54A63DBD5  created: 2016-11-08  expires: 2021-02-07
                                  card-no: 0006 09123456
```

### Alternatively, creating a new key on the card

If you don't have a GPG key, or you don't want to reuse it, this is simpler.

```bash
gpg --edit-card
```

Should bring you into a console for tinkering with the card. The `help` command will show you most of the common commands anyone should need. Most of the fun stuff is enabled with the `admin` command, which you should do.

```bash
gpg/card> admin
Admin commands are allowed

```

From there, you might want to use the `factory-reset` command, or at least know it's there. `passwd` will let you change the PIN (default: 123456), or the Admin PIN (default: 12345678).

Run the following two commands:

```bash
gpg/card> admin
Admin commands are allowed

gpg/card> generate
```

It will ask you if you want an off-key backup, which it's not a bad idea to do, and take the file in `~/.gnupg/sk_????????????????.gpg` and the similar file in `~/.gnupg/openpgp-revocs.d/*`, and copy those to a reliable and secure location. Treat these like you would treat your passport. You can get another, but you really don't want to because you will lose all of your visas and history.

### Test it out

You should now be able to sign something like a git commit... Configure it like this (with your own key, of course)

```
git config --global commit.gpgsign true
git config --global user.signingkey 427E032939DB40F29D03D80F5B640B9F9600F122
git config --global log.showSignature true
```

Then go commit somewhere; it should ask you for a pin. Then `git log` and you can see your signature.

```
commit a7558903018908258386c9cdabca70e47c6aed24 (HEAD -> master, origin/master)
gpg: Signature made Fri Jun 12 03:26:18 2020 GMT
gpg:                using RSA key D5CBFB11287E0B3A287DF591FD8194C54A63DBD5
gpg: Good signature from "Philihp Busby <philihp@gmail.com>" [ultimate]
Author: Philihp Busby <philihp@gmail.com>
Date:   Fri Jun 12 03:26:18 2020 +0000

    Committing like a pro!

```

The UI you get for PIN entry is a ncurses-driven text-based PIN entry. This can cause [issues](https://github.com/sindresorhus/np/issues/79) with other command line programs, or weird behavior if you commit with a GUI.

![](http://i.philihp.com/Screen-Shot-2020-06-13-at-4.30GMT-1592022641.png)

I like to use a GUI-driven PIN entry as another layer of being sure I'm not being spoofed into unlocking my Yubikey; setting that up is as simple as

```
brew install pinentry-mac
echo "pinentry-program /usr/local/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
```

and then kill any existing gpg-agent process.

## Configuring Passwordstore

Now that that's sorted, it's time to setup Passwordstore! [Passwordstore](https://www.passwordstore.org/) is a [719](https://git.zx2c4.com/password-store/tree/src/password-store.sh) line shell script that fulfills a lot of the same functions as any commercial password manager. It's a posterchild for the [Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) by delegating encryption bits to GPG, and delegating the syncing of filesystems with nonlinear history to git. When decrypting a password, it gives it back to you in STDOUT, so you can pipe it as well. And it's short, so if that's not enough for you, or you're wondering how it works (as I once did when I wanted to use it in a team setting, which it does very well), you can read it and get a pretty good grasp on it. I love it. Setting it up is pretty easy. On macOS, just run

```bash
brew install pass
```

and then

```
pass init 427E032939DB40F29D03D80F5B640B9F9600F122
```

This will create a folder `~/.password-store`, with a file `.gpg-id` of with your ID in it. If you want other people (perhaps people on your team) to be able to decrypt the files here too, add them as a new line.

Now go to your Google Account and [create an App Password](https://myaccount.google.com/apppasswords). You should be given a 16 character lowercase password. Tell that to Pass with

```
pass insert gmail.com/philihp@gmail.com
```

Then if you go to `~/.password-store/gmail.com/` you should see a file `philihp@gmail.com.gpg`. All this is is a text file with your password, encrypted. Test out decrypting it with:

```
gpg --decrypt ~/.password-store/gmail.com/philihp@gmail.com.gpg
```

Another way to get that is with

```
pass gmail.com/philihp@gmail.com
```

or if you were going to paste this somewhere and didn't want it displayed to the screen,

```
pass -c gmail.com/philihp@gmail.com
```

Cool. Now you can programmatically request your own password from the command line. Now if we
had a highly configurable email client, we could tell it a command that goes and gets your password so it can login and show you your email.

If you want to sync this with another machine, you can run

```
pass git init
pass git remote add origin philihp@dolores.local:password-store.git
pass git push
```

And on your other machines, instead of reconfiguring this, you can just say

```
git clone philihp@dolores.local:password-store.git ~/.password-store
```

## Configuring Mutt to use Passwordstore

Install mutt (or [neomutt](https://neomutt.org/distro/homebrew)) with

```
brew install mutt
```

Then configure it by creating a file `~/.muttrc` with

```
set realname = "Philihp Busby"
set from = "philihp@gmail.com"
set use_from = yes
set envelope_from = yes

set smtp_url = "smtps://philihp@gmail.com@smtp.gmail.com:465/"
set smtp_pass = `pass show gmail.com/philihp@gmail.com`
set imap_user = "philihp@gmail.com"
set imap_pass = `pass show gmail.com/philihp@gmail.com`
set folder = "imaps://imap.gmail.com:993"
set spoolfile = "+INBOX"
set ssl_force_tls = yes
```

!> Notice the back-ticks on the `smtp_pass` and `imap_pass`. That's important, because it tells mutt that rather than "this is the password", it says to execute that and it will give you back the password.

Now startup mutt with

```
mutt
```

If doesn't manage to get your gmail password with this command, it will ask you for it.

## Conclusion

I hope I didn't expose myself by writing this, and admittedly this is a very unique snowflake for email; most people just use a browser on gmail.com. This setup has evolved over a couple years, and works very well for me.

There are some more things you can configure, which are not simple with other setups:

- Automatically sign and verify signatures, or encrypt and decrypt emails (but perhaps [don't always sign](https://gist.github.com/bnagy/8914f712f689cc01c267#footnote---no-signatures))

- Replace `ssh-agent` with `gpg-agent` and require your Yubikey to SSH or SCP.

- Configure your Gmail to use your Yubikey to login to the web

- [Tell Github about your PGP key](https://help.github.com/en/github/authenticating-to-github/telling-git-about-your-signing-key), so you'll get a fancypants "Verified" badge next to your commits.
