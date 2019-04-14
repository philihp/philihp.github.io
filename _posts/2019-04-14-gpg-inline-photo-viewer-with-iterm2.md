---
layout: post
title: GPG Inline Photo Viewer with iTerm2
date: 2019-04-14T05:40:00Z
categories: []
tags:
  - gpg
  - imgcat
  - photo
  - uid
---

<img src="{{ site.baseurl }}/assets/gpg-inline-photo.png" />

If you have a PGP key with a photo included as a UID, you can configure PGP to open it. Out of the box, this will
open a preview window, but with iTerm2 you can inline images into your console. The easiest way to do this is

```
brew tap eddieantonio/eddieantonio
brew install imgcat
```

Then in your `~/.gnupg/gpg.conf` file, add the line

```
photo-viewer "imgcat %i"
```
