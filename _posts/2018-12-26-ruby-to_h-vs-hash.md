---
layout: post
title: Creating a hash in Ruby using to_h vs Hash[]
date: 2018-12-27 13:37:00.000000000 -04:00
categories: []
tags:
  - ruby
  - hash
  - imperative
---

In Ruby, I've seen two ways of converting an array into a hash. Usually, this is right after having to map through every
key/value pair, which comes back with an array that looks like:

```ruby
array_of_pairs = [
  [ :key1, "value2" ],
  [ :key2, "value2" ],
  [ :key2, "value2" ],
]
```

I've seen two ways of converting this back into a hash: `Hash[array_of_pairs]` vs `array_of_pairs.to_h`

I wondered if one is faster than another or if it was a matter of syntax. To decide if there's a hard reason I should choose one over the other I ran a benchmark. I also tried using an imperative loop, which is also common.

```ruby
require 'benchmark'

s = 100
n = 100_000

Benchmark.bm(10) do |x|
  x.report('hash') do
    a = Array.new(s) { |i| [:"x#{i}", rand] }
    n.times { h = Hash[a] }
  end
  x.report('to_h') do
    a = Array.new(s) { |i| [:"x#{i}", rand] }
    n.times { h = a.to_h }
  end
  x.report('imperative') do
    a = Array.new(s) { |i| [:"x#{i}", rand] }
    n.times do
      h = {}
      a.each do |(k,v)|
        h[k] = v
      end
    end
  end
end
```

`Hash[]` and `to_h` performed similarly, enough such that it really doesn't matter one way or the other. Using a loop was a little less than twice as slow.

```
                 user     system      total        real
hash         0.730000   0.020000   0.750000 (  0.744900)
to_h         0.680000   0.020000   0.700000 (  0.708484)
imperative   1.220000   0.010000   1.230000 (  1.228013)
```

I chose to do this on a reasonably sized hash of 100 elements. I tried this on a hash with 10,000 elements and got similar results but took 100x as long, which is expected.
