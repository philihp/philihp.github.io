---
layout: post
title: Importing the Computer Modern font as Woff2
date: 2021-01-17T12:29:00Z
categories: []
tags:
  - latex
  - computer-modern
  - woff
  - css
  - font
---

I came across [this repo](https://github.com/spratt/Computer-Modern), which advertised that Computer Modern could be added to a website by simply including a bit of CSS. This is great, except:

<ol start="0">
  <li>It's missing the fixed width font <code>Computer Typewriter</code></li>
  <li>It's broken because of a Github Pages issue in that repo</li>
</ol>

So I reinvented the wheel. I got the OTF fonts from [CTAN](http://mirrors.ibiblio.org/CTAN/fonts/cm-unicode/fonts/otf/), which are usable as they are but I compressed them to WOFF2 with [this](https://github.com/google/woff2), so they're only half the size. Now I can include them with the CSS:

```html
<link rel="stylesheet" href="https://philihp.com/assets/fonts/fonts.css" />
<style>
  body {
    font-family: "Computer Modern", serif;
    font-display: fallback;
  }
  pre,
  code {
    font-family: "Computer Typewriter", monospace;
    font-display: fallback;
  }
</style>
```

[You can use this](https://caniuse.com/woff2) as long as you don't care for anyone using Internet Explorer, and [I'm okay with that](https://www.theverge.com/2019/2/8/18216767/microsoft-internet-explorer-warning-compatibility-solution).

The value you use for [`font-display`](https://css-tricks.com/almanac/properties/f/font-display/) is probably personal taste. How do you feel about late swaps of the font? I think `fallback` is a good compromise. [IE also fails at this](https://caniuse.com/?search=font-display).
