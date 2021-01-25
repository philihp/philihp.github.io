---
layout: post
title: Things I Learned from Wiring a Car Stereo
date: 2011-03-25T17:33:40
---

[<img
      src="{{ post.baseurl }}/assets/S2000Wiring2-150x150.png"
      alt="S2000 Wiring Diagram"
      title="S2000 Wiring Diagram"
      width="150"
      height="150"
      class="size-thumbnail wp-image-644" />](http://philihp.com/blog/wp-content/uploads/2011/03/S2000Wiring2.png)

So I just finished installing a car stereo into my car. I wanted to
do it myself to learn as much a possible. This post is to share bits of
information that were previously buried on message boards, or were myths that
car audio shops had previously told me (or debunked for me).

DISCLAIMER: I'm not a professional, any of this could be false, I just want to
share what I now know, and believe to be true.

### Running power

- The entire chassis is grounded. This is why you remove the black contact
  first when installing a battery; you don't want the red contact to brush up
  against the chassis and cause a short.
- Shorts are bad, because resistance approaches zero, and
  Voltage=Current\*Resistance. Voltage is a constant 12 volts, and all that
  current gets converted to heat (fire)
- Install fuses as close to the battery as possible. This reduces the risk of
  a short by accidentally touching the red wire to the chassis.
- Your amp should have fuses on it (e.g. mine each had two 25A fuses). Add up
  the total amperage, and use a fuse near the battery slightly higher than
  this (I used a 60A fuse going to each amp).
- Battery power to the amps is DC, while lines going from the amps to the
  speakers is AC. This is why you need expensive high gauge wire for power,
  but speaker wire can be relatively thin in comparison.
- It is a half-myth that electricity travels on the surface of the wire. This
  is only true for AC power, and should be <i>most</i> current travels on the
  surface, not all; so high thread-count for AC is important and not for DC.
  It is called the
  <a href="http://en.wikipedia.org/wiki/Skin_effect">skin effect</a>, and
  happens because at every point in a cross section of a wire, magnetic flux
  is inducing back EMF causing resistance, and the center of the wire is
  subject to highest amount of this. DC has no alternating flux, so this
  doesn't happen, and resistance is even across the cross section of the wire.
  <i>However</i> high threadcount wire can be bent more before breaking, so
  it's easier to snake around corners; that's really the only advantage of it
  for power wire.
- Avoid cheap alloy wires that are copper-coated. You can tell by looking at
  the ends of the wires where it is cut; it should be solid copper. Pure
  copper wire is fairly heavy too. If you get this wire, make sure it has low
  resistance.
- At high amperages, the resistance of the power wire becomes significant.
  Calculate amps by watts = amps \* volts (where volts is 12). If too much
  current goes through, too much heat is created which melts the insulation
  off and the wire touches the chassis which is grounded and causes a short.
  Since you installed a fuse, it will blow rather than your car catching on
  fire.
- When grounding the amps, use the same gauge you used for running power. The
  same amount of current flows through them. Since the chassis is grounded,
  they can be terminated by bolting these to the chassis. Sand down the area
  where they're bolted, because it's probably painted (to stop rust and
  corrosion).

### Amps and Speakers

- Class D amps are good for subwoofers. They are generally 2/1 channel, which
  means they have 2 channels, but you can "bridge" the two together to get
  twice the boost for one channel.
- Ignore the "max" watts of a speaker or amp, and only pay attention to RMS
  (Root Mean Square), which is essentially the "average" power of a speaker or
  amp. Don't buy speakers who don't list this, unless they are free, which in
  that case they are probably half of the "rated" power.
- Pair your amp to your speakers; which means get an amp with slightly more
  average power than the speakers.
- It is better to have underpowered speakers than an underpowered amp. If your
  volume goes too high the amp will start
  <a href="http://en.wikipedia.org/wiki/Clipping_(audio)">clipping</a> at
  peaks and troughs. At these points, pure DC is sent over the line rather
  than AC. DC creates heat which burns out the coils in your speakers. This is
  how speakers are usually blown.
- Do not run signal wires parallel to power. If they cross, make it happen
  perpendicularly. Electrical
  <a href="http://en.wikipedia.org/wiki/Electromagnetic_induction"
        >Induction</a
      >
  is a magical thing that you should avoid because it makes phantom buzzing in
  your music.

### Headunits

- This is the thing that goes in the dash, and is usually the flashiest and
  most superficial of things.
- All Alpine headunits have RCA plugs out that go to the amp. This is not
  always the case for other makers.
- There is a blue wire in the wiring harness somewhere; this should be run to
  the "remote" terminal on your amps. It is how the car tells the stereo that
  the car is on (rather than parked idle); without this your amps would always
  be on, and always be draining your battery. It's very low current, so really
  thin wire will suffice.

### Crossovers

- They separate high frequencies and low frequencies.
- These are electrically very simple things. You can build them yourself if
  you can solder. Don't spend a lot of money on them.
