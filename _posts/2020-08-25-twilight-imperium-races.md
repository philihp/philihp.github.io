---
layout: post
title: A Bayesian Analysis of Win Rates of Twilight Imperium Races
date: 2020-08-25T01:00:00Z
categories: []
tags:
  - ti4
  - twilight imperium
  - openskill
  - ranking
  - skill
---

A few months ago I wrote a library for running multiplayer match results through a bayesian analysis to generate ordinal skill rankings for players. I started playing Twilight Imperium with some friends, and came across [this](https://boardgamegeek.com/thread/1908461/races-tier-list-ranking-help-collect-data) wonderful BoardGameGeek thread with almost five thousand self-reported matches of each race and the game result. It's all self-reported, however intuitively with this many results, any dirty data should come out in the wash. Below are ordinally ranked races.

Internally, rather than represent a rating as a single number, e.g. Elo ratings, there is some unknowable Heisenberg uncertainty around a rating, and instead it's represented as a gaussian/normal distribution centered on &mu; with a spread of &sigma;.

### Aggregate Rankings

Rating here is calculated by &mu;-3&sigma;, so the algorithm is saying there's a [99.7% probability](https://en.wikipedia.org/wiki/68%E2%80%9395%E2%80%9399.7_rule) that race's rating is at least what it reports.

| Race                    | Rating      | &mu; (Mean) | &sigma; (Stddev) |
| ----------------------- | ----------- | ----------- | ---------------- |
| Universities of Jol-Nar | 25.17783798 | 27.75971891 | 0.8606269782     |
| Federation of Sol       | 24.68035069 | 27.20558052 | 0.8417432765     |
| Emirates of Hacan       | 24.15905166 | 26.70351120 | 0.8481531815     |
| Clan of Saar            | 23.32228024 | 26.36106674 | 1.0129288330     |
| Naalu Collective        | 23.15130408 | 26.09800162 | 0.9822325127     |
| Yssaril Tribes          | 22.59962450 | 25.51847678 | 0.9729507572     |
| L1Z1X Mindnet           | 22.39603483 | 25.17927526 | 0.9277468094     |
| Barony of Letnev        | 22.31060757 | 25.07096185 | 0.9201180951     |
| Winnu                   | 21.67067419 | 25.70762296 | 1.3456495890     |
| Mentak Coalition        | 21.46529532 | 24.31886462 | 0.9511897685     |
| Yin Brotherhood         | 21.32122119 | 24.60400779 | 1.0942622000     |
| Xxcha Kingdom           | 20.88291125 | 23.58119643 | 0.8994283962     |
| Nekro Virus             | 20.11306737 | 23.12521055 | 1.0040477260     |
| Embers of Muaat         | 19.66918023 | 22.75911323 | 1.0299776660     |
| Ghosts of Creuss        | 19.64592785 | 22.51871286 | 0.9575950046     |
| Arborec                 | 19.61730334 | 22.61314918 | 0.9986152823     |
| Sardakk N'orr           | 18.74714691 | 21.89530442 | 1.0493858370     |

Since race abilities are asymmetric, and tend to perform with varying degrees of success dependent on the number of opponents, I broke these down further among 3, 4, 5, and 6 player games. This is interesting to see how each is different vs their respective mean performance. Sample size of each of these is approximately the same.

#### 3 player

| Race                    | Rating      |
| ----------------------- | ----------- |
| Universities of Jol-Nar | 22.72400553 |
| Clan of Saar            | 22.01709142 |
| Naalu Collective        | 21.74858024 |
| Barony of Letnev        | 20.81119467 |
| Federation of Sol       | 20.68230305 |
| Winnu                   | 20.25990961 |
| Yssaril Tribes          | 19.81126008 |
| Yin Brotherhood         | 19.10534831 |
| Arborec                 | 18.61340575 |
| Emirates of Hacan       | 17.77329450 |
| Sardakk N'orr           | 17.69178725 |
| Mentak Coalition        | 17.00070891 |
| Xxcha Kingdom           | 16.69167889 |
| L1Z1X Mindnet           | 16.28278617 |
| Ghosts of Creuss        | 15.57459355 |
| Embers of Muaat         | 14.98028539 |
| Nekro Virus             | 14.14631767 |

#### 4 player

| Race (4 player)         | Rating      |
| ----------------------- | ----------- |
| Universities of Jol-Nar | 23.56908654 |
| Emirates of Hacan       | 22.81017836 |
| Federation of Sol       | 22.30073140 |
| Barony of Letnev        | 21.85553201 |
| Naalu Collective        | 21.22135540 |
| Clan of Saar            | 20.88426216 |
| Yssaril Tribes          | 20.56605905 |
| L1Z1X Mindnet           | 20.44148444 |
| Mentak Coalition        | 19.80596262 |
| Ghosts of Creuss        | 19.63050116 |
| Xxcha Kingdom           | 19.45644375 |
| Arborec                 | 19.29407333 |
| Nekro Virus             | 18.67410524 |
| Winnu                   | 18.13440263 |
| Yin Brotherhood         | 16.88316144 |
| Embers of Muaat         | 16.14584843 |
| Sardakk N'orr           | 15.72850978 |

#### 5 player

| Race (5 player)         | Rating      |
| ----------------------- | ----------- |
| Federation of Sol       | 22.60698818 |
| L1Z1X Mindnet           | 21.73337138 |
| Emirates of Hacan       | 21.67345473 |
| Universities of Jol-Nar | 21.12904255 |
| Yssaril Tribes          | 20.53781686 |
| Yin Brotherhood         | 20.03017664 |
| Naalu Collective        | 19.80487597 |
| Clan of Saar            | 19.74103594 |
| Xxcha Kingdom           | 19.11800700 |
| Mentak Coalition        | 18.63494300 |
| Embers of Muaat         | 17.89924484 |
| Ghosts of Creuss        | 17.52308272 |
| Nekro Virus             | 17.35853234 |
| Barony of Letnev        | 17.00026925 |
| Winnu                   | 15.66049172 |
| Arborec                 | 14.65157760 |
| Sardakk N'orr           | 14.20121780 |

#### 6 player

| Race (6 player)         | Rating      |
| ----------------------- | ----------- |
| Federation of Sol       | 24.26156239 |
| Universities of Jol-Nar | 24.15462774 |
| Emirates of Hacan       | 23.78689351 |
| Clan of Saar            | 21.88890502 |
| Naalu Collective        | 21.81149146 |
| L1Z1X Mindnet           | 20.86840867 |
| Yssaril Tribes          | 20.03274522 |
| Barony of Letnev        | 19.87474131 |
| Mentak Coalition        | 19.57421196 |
| Winnu                   | 19.22243110 |
| Xxcha Kingdom           | 18.19493305 |
| Nekro Virus             | 18.09263800 |
| Embers of Muaat         | 17.99331308 |
| Yin Brotherhood         | 17.82981651 |
| Arborec                 | 16.92892221 |
| Sardakk N'orr           | 16.45328180 |
| Ghosts of Creuss        | 15.88655724 |

### Aggregate Rankings per Experience Level

One takeaway here is Winnu performs better than expected, with a high degree of variance. The race is also vastly unpopular, and played about half as often as other races so Openskill has a harder time narrowing down on a rating. We probably can't say that experienced players will overestimate them, though. Since the source data contains a self-described "experience" classifier, we can see how this performs with beginners versus intermediate and advanced players.

| Race                    | Skill        | Rating      |
| ----------------------- | ------------ | ----------- |
| Federation of Sol       | Advanced     | 30.60907345 |
| Universities of Jol-Nar | Advanced     | 30.00323694 |
| Emirates of Hacan       | Advanced     | 29.32877358 |
| Yssaril Tribes          | Advanced     | 28.29546669 |
| Naalu Collective        | Advanced     | 27.88565763 |
| Clan of Saar            | Advanced     | 26.84950496 |
| Mentak Coalition        | Advanced     | 26.48814197 |
| L1Z1X Mindnet           | Advanced     | 25.98531610 |
| Xxcha Kingdom           | Advanced     | 25.36631530 |
| Universities of Jol-Nar | Intermediate | 25.04583848 |
| Federation of Sol       | Intermediate | 24.99641470 |
| Barony of Letnev        | Advanced     | 24.46872531 |
| Emirates of Hacan       | Intermediate | 24.45491619 |
| Embers of Muaat         | Advanced     | 24.09007175 |
| Yin Brotherhood         | Advanced     | 23.94127557 |
| Barony of Letnev        | Intermediate | 23.82854930 |
| Nekro Virus             | Advanced     | 23.31099933 |
| Clan of Saar            | Intermediate | 23.21175442 |
| Ghosts of Creuss        | Advanced     | 22.79161677 |
| Arborec                 | Advanced     | 22.70521399 |
| L1Z1X Mindnet           | Intermediate | 22.49837161 |
| Winnu                   | Advanced     | 22.34945804 |
| Xxcha Kingdom           | Intermediate | 22.01560255 |
| Yssaril Tribes          | Intermediate | 21.98374204 |
| Naalu Collective        | Intermediate | 21.97271666 |
| Yin Brotherhood         | Intermediate | 21.74583770 |
| Sardakk N'orr           | Advanced     | 21.58468850 |
| Ghosts of Creuss        | Intermediate | 20.38895273 |
| Mentak Coalition        | Intermediate | 20.11534065 |
| Nekro Virus             | Intermediate | 19.92369537 |
| Embers of Muaat         | Intermediate | 19.51033925 |
| Arborec                 | Intermediate | 19.49624435 |
| Winnu                   | Intermediate | 18.58748763 |
| Federation of Sol       | Beginner     | 18.06861607 |
| Universities of Jol-Nar | Beginner     | 17.94425337 |
| Sardakk N'orr           | Intermediate | 17.67737576 |
| Emirates of Hacan       | Beginner     | 17.26997944 |
| Naalu Collective        | Beginner     | 15.92627194 |
| L1Z1X Mindnet           | Beginner     | 14.49165522 |
| Clan of Saar            | Beginner     | 13.89991205 |
| Mentak Coalition        | Beginner     | 13.84376820 |
| Yssaril Tribes          | Beginner     | 13.54292539 |
| Barony of Letnev        | Beginner     | 13.43430308 |
| Winnu                   | Beginner     | 12.64705960 |
| Xxcha Kingdom           | Beginner     | 12.26642650 |
| Yin Brotherhood         | Beginner     | 11.40798903 |
| Nekro Virus             | Beginner     | 10.97676076 |
| Embers of Muaat         | Beginner     | 10.93323739 |
| Ghosts of Creuss        | Beginner     | 10.32771177 |
| Arborec                 | Beginner     | 10.21294854 |
| Sardakk N'orr           | Beginner     | 9.38140506  |

#### 3 player

| Race                    | Skill        | Rating      |
| ----------------------- | ------------ | ----------- |
| Federation of Sol       | Advanced     | 28.35842920 |
| Clan of Saar            | Advanced     | 22.19586105 |
| Naalu Collective        | Advanced     | 22.07393017 |
| Universities of Jol-Nar | Intermediate | 21.58011268 |
| Barony of Letnev        | Intermediate | 20.04751044 |
| Federation of Sol       | Intermediate | 19.79323260 |
| Clan of Saar            | Intermediate | 19.75206821 |
| Naalu Collective        | Intermediate | 19.49237002 |
| Yin Brotherhood         | Intermediate | 19.12075107 |
| Yin Brotherhood         | Advanced     | 18.24795462 |
| Universities of Jol-Nar | Advanced     | 17.67682680 |
| Winnu                   | Advanced     | 17.59674256 |
| Sardakk N'orr           | Intermediate | 17.09480067 |
| Barony of Letnev        | Advanced     | 16.94918973 |
| Yssaril Tribes          | Intermediate | 16.82426022 |
| Emirates of Hacan       | Advanced     | 16.71328359 |
| Xxcha Kingdom           | Intermediate | 16.65088203 |
| Arborec                 | Advanced     | 15.82658929 |
| L1Z1X Mindnet           | Advanced     | 15.28411227 |
| Universities of Jol-Nar | Beginner     | 15.15283050 |
| Arborec                 | Intermediate | 14.83767142 |
| Ghosts of Creuss        | Intermediate | 14.83303881 |
| Mentak Coalition        | Advanced     | 14.46162133 |
| Emirates of Hacan       | Intermediate | 14.29516927 |
| L1Z1X Mindnet           | Intermediate | 14.25209345 |
| Naalu Collective        | Beginner     | 14.23268881 |
| Winnu                   | Intermediate | 13.29475026 |
| Embers of Muaat         | Intermediate | 13.21816327 |
| Federation of Sol       | Beginner     | 12.97932160 |
| Mentak Coalition        | Intermediate | 12.94256326 |
| Xxcha Kingdom           | Advanced     | 12.77991692 |
| Sardakk N'orr           | Advanced     | 12.34996131 |
| Yssaril Tribes          | Beginner     | 12.02002843 |
| Barony of Letnev        | Beginner     | 11.98649407 |
| Clan of Saar            | Beginner     | 11.72262389 |
| Emirates of Hacan       | Beginner     | 11.35077961 |
| Embers of Muaat         | Advanced     | 10.85411247 |
| Yssaril Tribes          | Advanced     | 10.46650665 |
| Winnu                   | Beginner     | 10.24769693 |
| Arborec                 | Beginner     | 10.13040202 |
| Nekro Virus             | Beginner     | 8.99587795  |
| L1Z1X Mindnet           | Beginner     | 8.88800772  |
| Ghosts of Creuss        | Beginner     | 8.85522639  |
| Nekro Virus             | Intermediate | 8.54002581  |
| Mentak Coalition        | Beginner     | 8.53487268  |
| Xxcha Kingdom           | Beginner     | 7.79029366  |
| Ghosts of Creuss        | Advanced     | 6.52756990  |
| Nekro Virus             | Advanced     | 5.99907088  |
| Sardakk N'orr           | Beginner     | 5.10565191  |
| Embers of Muaat         | Beginner     | 4.72155823  |
| Yin Brotherhood         | Beginner     | 1.62033691  |

#### 4 player

| Race                    | Skill        | Rating      |
| ----------------------- | ------------ | ----------- |
| Emirates of Hacan       | Advanced     | 27.41685857 |
| Federation of Sol       | Advanced     | 27.12632515 |
| Universities of Jol-Nar | Advanced     | 25.98764682 |
| Barony of Letnev        | Advanced     | 24.75410318 |
| Yssaril Tribes          | Advanced     | 24.65746627 |
| Clan of Saar            | Intermediate | 24.41965864 |
| Clan of Saar            | Advanced     | 24.36933895 |
| Ghosts of Creuss        | Advanced     | 23.67478226 |
| Naalu Collective        | Intermediate | 23.06349920 |
| Arborec                 | Advanced     | 22.34279091 |
| Federation of Sol       | Intermediate | 22.11128085 |
| Barony of Letnev        | Intermediate | 21.55657956 |
| Universities of Jol-Nar | Intermediate | 21.14545395 |
| Emirates of Hacan       | Intermediate | 20.86726212 |
| L1Z1X Mindnet           | Intermediate | 20.78223587 |
| Naalu Collective        | Advanced     | 20.71476420 |
| L1Z1X Mindnet           | Advanced     | 20.30099494 |
| Nekro Virus             | Intermediate | 20.04592528 |
| Nekro Virus             | Advanced     | 19.14202315 |
| Xxcha Kingdom           | Advanced     | 18.98693015 |
| Ghosts of Creuss        | Intermediate | 18.69450804 |
| Mentak Coalition        | Advanced     | 18.68118344 |
| Xxcha Kingdom           | Intermediate | 18.56008902 |
| Yssaril Tribes          | Intermediate | 18.48626891 |
| Mentak Coalition        | Intermediate | 17.84763184 |
| Winnu                   | Advanced     | 17.28844185 |
| Arborec                 | Intermediate | 16.69693677 |
| Embers of Muaat         | Advanced     | 16.66367115 |
| Yin Brotherhood         | Advanced     | 16.59169254 |
| Yin Brotherhood         | Intermediate | 15.83040628 |
| Universities of Jol-Nar | Beginner     | 15.81007492 |
| Embers of Muaat         | Intermediate | 15.47055078 |
| Federation of Sol       | Beginner     | 14.67140062 |
| Emirates of Hacan       | Beginner     | 14.62092735 |
| Sardakk N'orr           | Advanced     | 14.10729327 |
| Winnu                   | Intermediate | 13.12065630 |
| Sardakk N'orr           | Intermediate | 12.24657652 |
| L1Z1X Mindnet           | Beginner     | 12.15983136 |
| Barony of Letnev        | Beginner     | 11.80266354 |
| Yssaril Tribes          | Beginner     | 11.16116908 |
| Xxcha Kingdom           | Beginner     | 11.10725323 |
| Naalu Collective        | Beginner     | 10.18696673 |
| Mentak Coalition        | Beginner     | 9.99142409  |
| Ghosts of Creuss        | Beginner     | 9.13803070  |
| Winnu                   | Beginner     | 9.09935158  |
| Clan of Saar            | Beginner     | 8.93580276  |
| Arborec                 | Beginner     | 7.08075890  |
| Yin Brotherhood         | Beginner     | 6.71407429  |
| Sardakk N'orr           | Beginner     | 6.66415085  |
| Embers of Muaat         | Beginner     | 6.58220814  |
| Nekro Virus             | Beginner     | 5.94971620  |

#### 5 player

| Race                    | Skill        | Rating       |
| ----------------------- | ------------ | ------------ |
| Universities of Jol-Nar | Advanced     | 26.40951856  |
| Naalu Collective        | Advanced     | 26.09599426  |
| Federation of Sol       | Advanced     | 24.28649281  |
| Yssaril Tribes          | Advanced     | 23.31078670  |
| Universities of Jol-Nar | Intermediate | 23.03156183  |
| Mentak Coalition        | Advanced     | 22.88911195  |
| Xxcha Kingdom           | Advanced     | 22.70454211  |
| L1Z1X Mindnet           | Advanced     | 22.47887765  |
| Emirates of Hacan       | Advanced     | 22.46079117  |
| Ghosts of Creuss        | Advanced     | 22.36559566  |
| Federation of Sol       | Intermediate | 20.84047316  |
| Clan of Saar            | Advanced     | 20.09023957  |
| L1Z1X Mindnet           | Intermediate | 20.02042594  |
| Embers of Muaat         | Advanced     | 19.73944017  |
| Emirates of Hacan       | Intermediate | 19.55730314  |
| Yssaril Tribes          | Intermediate | 18.92498108  |
| Yin Brotherhood         | Intermediate | 18.76434052  |
| Xxcha Kingdom           | Intermediate | 18.69266094  |
| Yin Brotherhood         | Advanced     | 17.82495338  |
| Arborec                 | Advanced     | 17.74965882  |
| Naalu Collective        | Intermediate | 17.15486551  |
| Sardakk N'orr           | Advanced     | 17.11566967  |
| Clan of Saar            | Intermediate | 16.64206843  |
| Barony of Letnev        | Intermediate | 16.33207741  |
| Nekro Virus             | Advanced     | 16.19982226  |
| Arborec                 | Intermediate | 15.55468130  |
| Mentak Coalition        | Intermediate | 15.42719412  |
| Federation of Sol       | Beginner     | 15.34569621  |
| Barony of Letnev        | Advanced     | 15.33413489  |
| Embers of Muaat         | Intermediate | 15.32630181  |
| Ghosts of Creuss        | Intermediate | 15.11307261  |
| Nekro Virus             | Intermediate | 14.87724946  |
| Winnu                   | Advanced     | 12.82994599  |
| Emirates of Hacan       | Beginner     | 12.76963523  |
| Universities of Jol-Nar | Beginner     | 12.63083834  |
| Winnu                   | Intermediate | 11.70944388  |
| Naalu Collective        | Beginner     | 11.50965206  |
| L1Z1X Mindnet           | Beginner     | 10.19190402  |
| Mentak Coalition        | Beginner     | 10.15234779  |
| Sardakk N'orr           | Intermediate | 10.09528497  |
| Yssaril Tribes          | Beginner     | 9.011886311  |
| Clan of Saar            | Beginner     | 8.642295667  |
| Yin Brotherhood         | Beginner     | 8.174616094  |
| Xxcha Kingdom           | Beginner     | 7.595298702  |
| Nekro Virus             | Beginner     | 7.269565769  |
| Embers of Muaat         | Beginner     | 6.636267959  |
| Barony of Letnev        | Beginner     | 5.982703736  |
| Ghosts of Creuss        | Beginner     | 4.545880900  |
| Sardakk N'orr           | Beginner     | 2.233827176  |
| Winnu                   | Beginner     | 1.861867246  |
| Arborec                 | Beginner     | -0.313055713 |

#### 6 player

| Race                    | Skill        | Rating      |
| ----------------------- | ------------ | ----------- |
| Universities of Jol-Nar | Advanced     | 29.30604802 |
| Federation of Sol       | Advanced     | 28.79152602 |
| Yssaril Tribes          | Advanced     | 28.26945873 |
| Emirates of Hacan       | Advanced     | 26.78807763 |
| Naalu Collective        | Advanced     | 26.29754493 |
| L1Z1X Mindnet           | Advanced     | 26.27279148 |
| Xxcha Kingdom           | Advanced     | 24.65932500 |
| Mentak Coalition        | Advanced     | 24.51731564 |
| Emirates of Hacan       | Intermediate | 24.43834184 |
| Universities of Jol-Nar | Intermediate | 23.88263850 |
| Federation of Sol       | Intermediate | 23.50092211 |
| Clan of Saar            | Advanced     | 22.64128027 |
| Embers of Muaat         | Advanced     | 22.29999029 |
| Barony of Letnev        | Intermediate | 21.88630842 |
| Nekro Virus             | Advanced     | 21.36942925 |
| Clan of Saar            | Intermediate | 20.66955656 |
| Yin Brotherhood         | Advanced     | 20.42376125 |
| Barony of Letnev        | Advanced     | 20.09158084 |
| Yssaril Tribes          | Intermediate | 19.70508387 |
| L1Z1X Mindnet           | Intermediate | 19.15440624 |
| Mentak Coalition        | Intermediate | 18.76436872 |
| Winnu                   | Advanced     | 18.71805711 |
| Sardakk N'orr           | Advanced     | 18.27876607 |
| Naalu Collective        | Intermediate | 17.83173565 |
| Xxcha Kingdom           | Intermediate | 17.71077249 |
| Ghosts of Creuss        | Advanced     | 16.95129573 |
| Yin Brotherhood         | Intermediate | 16.34530525 |
| Federation of Sol       | Beginner     | 16.30904960 |
| Arborec                 | Advanced     | 15.88364406 |
| Ghosts of Creuss        | Intermediate | 15.85997772 |
| Winnu                   | Intermediate | 15.73101650 |
| Embers of Muaat         | Intermediate | 15.63534945 |
| Nekro Virus             | Intermediate | 15.44865376 |
| Arborec                 | Intermediate | 14.97098940 |
| Emirates of Hacan       | Beginner     | 14.66100957 |
| Universities of Jol-Nar | Beginner     | 14.22018825 |
| Sardakk N'orr           | Intermediate | 13.84072241 |
| Naalu Collective        | Beginner     | 13.69977576 |
| Clan of Saar            | Beginner     | 9.07924681  |
| L1Z1X Mindnet           | Beginner     | 7.88780919  |
| Barony of Letnev        | Beginner     | 7.58641659  |
| Mentak Coalition        | Beginner     | 6.71237862  |
| Xxcha Kingdom           | Beginner     | 5.06243542  |
| Arborec                 | Beginner     | 4.77849320  |
| Embers of Muaat         | Beginner     | 3.59396214  |
| Yin Brotherhood         | Beginner     | 3.58529868  |
| Nekro Virus             | Beginner     | 3.17071658  |
| Yssaril Tribes          | Beginner     | 3.06349557  |
| Winnu                   | Beginner     | 2.87900750  |
| Sardakk N'orr           | Beginner     | 2.21474336  |
| Ghosts of Creuss        | Beginner     | 0.85199654  |

If you consider yourself advanced and draw Letnev, don't try to be fancy. Just get capital ships.

### Conclusion

The difference in ratings between Beginner vs. Intermediate vs. Advanced being so pronounced should indicate that most of the races are fairly balanced, and a player's experience matters a great deal more than their race's innate abilities. That said, when coming to the table to play a game as lengthy as this in a tournament, if your race is not randomly selected for you, you can use these tables to perhaps select an ideal race for winning.

None of this should invalidate the golden rule, though: Pick a race you think you'll have fun playing. If you really want a ~~Death Star~~War Sun, go with Muaat and if you win, know that you did it against the odds.

### References

- https://boardgamegeek.com/thread/1908461/races-tier-list-ranking-help-collect-data
- https://docs.google.com/spreadsheets/d/1SE1u4d-u2OoB4gpCwDTuhNKz3wAr7pJivCLF5VoAotU/edit?usp=sharing
