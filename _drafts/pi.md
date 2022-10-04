### Abstract

The following is a batshit crazy setup to make P4 used in Capital Core Temperature Regulators. At 1dq-split prices this makes 3 billion/month, and takes about 2 hours of work every 4 days. It used to be P1 was the bottleneck, but with Siege Green changes, this is now the P4. We've seen the cost of this P4 double in the last week, and since PI production is [highly inelastic](https://en.wikipedia.org/wiki/Price_elasticity_of_supply), this should stay high until people alter their factories, and it is better for goons to command the means of production.

### Requirements

- 2 Accounts, each with 3 characters
- Command Center Upgrades V on at least one character for four factory planets.
- Interplanetary Consolidation IV on all characters, and V on at least 4 characters to have 34 planets.
- 4 large storage containers (for logistics)
- 2 Epithals (preferably 6)
- about 350 million ISK for setting things up (if this is an issue, you can build this up slowly by selling off your P1, or asking someone for a loan)

### Timeline

- Day 1: 3-4 hours of planning
- Day 2: 2-3 hours of setting up a total of 10 extractor planets
- Day 3: 2-3 hours of setting up a total of 10 extractor planets
- Day 4: 2-3 hours of setting up a total of 10 extractor planets
- Day 8: 2 hours of collecting P1, 1 hour delivering P1, 1 hour of setting up P1->P3 routing
- Day 12: 2 hours of collecting P1, 1 hour delivering P1, 30 minutes of setting up P3 routing.
- Day 16: 2 hours of collecting P1, 1 hour delivering P1, and you get P4 finally
- Repeat day 16 every 4 days.

## Background

There was [a significant change to industry](https://www.eveonline.com/news/view/a-significant-update-to-industry) in 2021 that made the production of capital ships (Dreadnaughts, Carriers, Motherships, and Titans) (1) more complicated, (2) more skill intensive, and (3) more expensive. The first two we can brush off, but considering (3) all capital production for the last year had been effectively eliminated, as the cost of raw materials made it actually a losing activity to build anything bigger than a Jump Freighter. A lot of industrialists just John Galted out of the picture.

[graph from FanFest]

The most common complaint was the amount of [Water](https://everef.net/type/3645) necessary to produce a capital was outrageous, and without any way to compress this it was prohibitively expensive to source this anywhere but locally. Since it came from PI, rates of generating it were capped and this made it a highly strategic component of [Capital Core Temperature Regulator](https://everef.net/type/57524)s, which at the time were approximately a 2-3 billion ISK common component of all capitals.

## Recent Changes

We all knew something had to change to make producing capitals viable. Personally I always thought it would be another M2- to kill existing stocks, but a month ago we found out with [Siege Green](https://www.eveonline.com/news/view/siege-green) would have an across-the-board [reduction](https://www.eveonline.com/news/view/patch-notes-version-20-05#Science) in Water needed brought the capital components needed to build a Capital ship below the market cost of buying one second-hand, and in line with the margins from producing T2 sub-caps. Now that capital ships are a profitable endeavor, it's time for the Imperium to do what it does best and out-blob the rest of New Eden in capital ships, and producing this component is going to be bottlenecked by a few other things.

[before/after pie charts of relative costs of a CCTR]

- Reacting common R4 moongoo into [Reinforced Carbon Fiber]() (RCF) and [Pressurized Oxidizers]() (POX), which is easy to ramp up
- PI factories building [Integrity Response Drones]() (IRDs) and [Self-Harmonizing Power Core]() (SHPCs)

Industrialists can ramp up reactions, but Planetary Interaction has a hard cap. If we do nothing, the value of these just goes up until the pubbies setup their own chains for it. Fuck that. Here's a setup for optimally producing these.

### Planning P3/P4 Factory Planets

Each Launch Pad on a planet has its own Expedited Transfer timer, which you can abuse to load up a planet with 20,000 m^3 worth of P1. This setup uses this basic building P1:P3 block:

- 1 Launch Pad
- 1 Storage
- 4 (A-type) or 6 (B-type) advanced factories to build P1 to P2
- 1 factory to build P2 to P3

[diagram of A-type]
[diagram of B-type]

The longest this can run is either capped by the inputs or the size of the outputs. On the input side, a B-type factory consumes 480 (6\*80) units of each type and each unit of P1 is 0.38 m3, so 109 cycles/hours worth. On the output side, however, we're capped by the P4 being 100m3 and a Launch Pad only having 10,000 m3, so we can only leave things alone for 100 hours. Let's just make that 96 hours so it's an even 4 days, and give ourselves a little buffer space for P3 (which you'll see later)

Our SHPCs need 6 B-type P1:P3 blocks, and our IRDs need 6 A-type blocks. Conveniently, with [Command Center Upgrades]() V, 3 blocks fit on a planet (so long as they aren't all A-type), with room to spare for the high-tech factory, so setup 4 of your factory planets like so:

[PF1 photo]
[PF2 photo]
[PF3 photo]
[PF4 photo]

Each of these lauchpads every 96 hours is going to need either 4 or 6 kinds of P1, and when it's a B-type, it'll just barely fit 7,680 \* 6 units of P1. You'll have 2 of every kind of P1:P3 block, so for every type of P1 you need 15,360 units (a "chunk") every 4 days

### Planning P1 Extraction Planets

A lot of people do PI and optimize for finding planets where they _can_ do something like P0->P1->P2<-P1<-P2 all on one planet, with two different kinds of P1. In doing this, you avoid the export/import fee of taking P1 off planet and back onto another planet... however in Goonspace, we have at least a barren planet in every system with 1% tax, so the lift here is mostly in effort. This setup focuses extraction planets to simply P0->P1 because the densities of those tend to move most and be variable across planets.

For your 6 B-type blocks needing 18 types of P1, and your 6 A-type blocks needing 12 types of P1, you need a total of 30 of these P1 "chunks" of 15,360. There's some overlap, for instance you need 3 chunks of Silicon (46080 units), however the most a planet can extract is 26,315 and in practice it's pretty rare to get above 18,000 units. So make a table like this:

Bacteria
Biofuels
Biofuels
Chiral Structures
Chiral Structures
Silicon
Silicon
Silicon

Now find a centralized system with at least 2 Barren or Temperate planets that have 1% tax (High-Tech Factories can only be on these types). Even better if there 2 more planets with 1% tax. Make a big list of all of the local planets in neighboring systems and their types

W-IX39 I Barren
W-IX39 II Barren
W-IX39 III Temperate
W-IX39 IV Storm
W-IX39 V Gas

For each of these planets, you want to do a survey of how hot the hotspots are. You can't really rely on the bars in the top left. Extend the bounds of the slider to their extremes and look at the color of the hotspots on the planet. This is a better way to measure how much P1 you'll extract from it; for instance look at Felsic Magma on a Magma planet. They usually look shitty, but all of it is always concentrated on volcanic texture. On your table, write an approximate number of the hottest hotspots; if you find white spots, just put a star because you'll definitely be using that planet.

[diagram of how to survey]

Next, you'll circle all of the highest cells for where you'll put factories. Start with Proteins because those are annoyingly sparse. These circles are going to be your factory planets, and you're doing this to avoid tapping out your own planets by doing something like having 3 of your characters extracting the same thing on the same planet. Also, while doing this you can minimize jumps if you do groups of 6 in one system.

|> This is a good time for a break. Go buy some command centers of the types you need, and get 6 epithals.

### Building Extraction Planets

Finally, the hard part: building the planets. You need each of these planets to pull a chunk of 15,360 every day, but that's really your only constraint so feel free to experiment here. You can do that with 4 basic factories and like 8 storage, but I've found you can do better with 6 and 6.

<-F<-F<-S<-S
LP<-F<-F<-S<-S<-Ex (10 heads)
<-F<-F<-S<-S
(CCU 5)

<-F<-F<-S
LP<-F<-F<-S<-Ex (< 10 heads)
<-F<-F<-S
(CCU 4)

When building this, keep the structures close because the links eat up a lot of powergrid. This is especially true on Gas planets, and you'll probably have to get by with less than the max of 10 extractor heads.

When you build the extractor and route the output, take these and divide them evenly among all of the storages. Whenever you position the heads, this ratio will be kept even though the total will change every time. Then route the storages to the factories, and the factories to the launch pad.

[diagram of setups with routing arrows]

|> This is a lot of work. Don't do it all at once, you'll burn out; maybe do 10 today, 10 tomorrow, and 10 the next day.

### Building Factory Planets

Each planet is going to make 2 of one kind of P3, and 1 of a third kind of P3. Build the 3 launch pads first and confirm the build. The reason for this is you want the ID of the launch pad; when you access the customs office, the first one will be the first alphabetically, so you want this to be the "1 of a third kind". Trust me on this one, unless you hate yourself, but hey you're doing PI so whatever, live your life.

[PF1 photo, annotated]
[PF2 photo, annotated]
[PF3 photo, annotated]
[PF4 photo, annotated]

For now, just build the things. You can't really do the routing until you actually have the first round of inputs from the P1.

### Routing P1->P3

In a centralized station, assemble your 4 containers and give them the name of the 4 planets. In each, deposit the following chunks of P1 (in stacks of 7680).

...plan...

In your epithal, take everything from the 1st container out in your Epithal, and go to PF1. While you're in warp, access the customs office in one window and open your cargo hold and arrange alphabetically. You'll see 6 paired stacks, and 6 single stacks. Select the first 3 of the single stacks and when you land on grid with the POCO drag it into the window, then drag these over and click transfer.

Then open up the PF1 planet surface, click the launch pad, and expedited transfer it over to the adjacent storage. Since you made the first alphabetical launch pad to be your "1 of a kind", this should be the right one. Then exit back to spaceship take the other 3 single stacks and transfer those to the launchpad. You should see something like this:

Now with the other paired stacks, take the first 3 alphabetically and transfer those to the second launch pad. Then take the other 3 of that type and transfer it to the third launch pad. Open up the planet surface and expedite those to the adjacent storages. Then exit back to spaceship and get the last 6 stacks to the surface. You should be left with this:

Now warp back to station tether, because you're going to be looking at the surface for a while.

With each of the P1:P3 blocks, route the P1's into the advanced factories, and their P2's back to the launch pad, then route the P2 to the other advanced factory, and its P3 back to the launch pad.

Do this same thing with the other 3 planets.

|> You're almost there, wait 4 days and come back and collect the P3.

### Routing P3->P4

After 4 days, go around to all of your P1 planets again and collect what they've made and reset the extractors. Then go to your factories and collect the P3. Take this all back and distribute the P1 as you did on the last cycle, but also add P3 to that, like this:

PF1
P3-A
P3-B
P3-C

PF2
P3-D
P3-E

Every 4 days you'll repeat this, and every 4 days you'll get collect P4.

### Extra Credit

Incidentally, there's some extra powergrid on PF3 and PF4. This is enough to build 144 P3 (Robotics) and 960 P2 (Coolant? Mechanical Parts? Up to you). Depending on the planets you selected, you'll have some extra P1 which you can use to make some extra stuff. Consult [this spreadsheet]() or Adam4Eve to figure out the ideal factories; there are some new blueprints for [Neurolink Protection Cell]()s which use a small amount.
