---
layout: post
title: Mining Bitcoin in the Eligius pool using Phoenix2
date: 2013-04-21T22:43:35Z
tags:
  - bitcoin
  - eligius
  - How To
  - phoenix2
  - pool
  - setup
  - tutorial
---

I prefer to use the [Eligius](http://eligius.st) bitcoin mining pool because the pool takes no cut (compared to the larger, more popular [BTC Guild](http://www.btcguild.com/), which takes 3-5%). The "[getting started](http://eligius.st/wiki/index.php/Getting_Started)" for the Eligius Bitcoin mining pool doesn't show how to configure Phoenix2, which is faster than, and supports more features over the older Phoenix 1.xx miner. Here's a quick/dirty tutorial of how I set them up to work together on my machine.

> NOTE: It's cheaper to buy bitcoin on an exchange than to mine it. The cost of a dedicated machine will probably take 1-2 years to recoup.

## Step 1: Download [Phoenix 2](https://github.com/downloads/phoenix2/phoenix/phoenix-2.0.0.zip)

Extract it to a folder on your hard drive, like <code>c:phoenix</code>. Anywhere. Doesn't really matter.

## Step 2: Create phoenix.cfg

Create it in that same folder. It should contain something like this. Once running you can play around with some of the parameters.

```cfg
[general]
    autodetect = +cl -cpu
    verbose = False
    backend = http://1PhiLHuzbozkqVkWYZEUiptKNGYNfne9Hb:x@mining.eligius.st:8337
    backups = http://rpcuser:rpcpassword@localhost:8332/
    failback = 600
    queuesize = 1
    ratesamples = 100
    logfile = False
[cl:0:0]
    name = GPU 0
    kernel = phatk2
    aggression = 1
    bfi_int = True
    fastloop = False
    goffset = True
    vectors = True
    vectors4 = False
    worksize = 128
```

Once running, you can tinker around with these last parameters to get the highest Mhash/s rate. You will want to change the username to be the backend property to be where you want your rewards to be sent when the pool finds a new block (ideally yourself). You will also need some luck for the pool to start finding Bitcoin. You can generate a higher chance of that happening by donating bitcoin to `1McRinAordxvTPVRMP4XGZNxJdnqct2YGB`

Step 3: There is no step 3. Just run `phoenix.exe` from that folder. Go find something to do while your computer makes you money.
