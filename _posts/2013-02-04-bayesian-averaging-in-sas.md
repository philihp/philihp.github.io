---
layout: post
title: Bayesian Averaging in SAS
date: 2013-02-04 22:53:46.000000000 -08:00
tags:
  - average
  - bayesian
  - Programming
  - rank
  - rating
  - SAS
redirect_from:
  - /blog/2013/bayesian-averaging-in-sas/
---

<p>Hypothetical situation, lets say you've got a list of movies that you want to rank in a website or a report or something, and you have user-submitted ratings for them, but some are more popular than others, so your data looks like this:</p>

```sas
data ratings;
  input name $ rating;
  datalines;
Lincoln 9
Lincoln 8
Lincoln 9
Amour 9
Argo 5
Argo 10
;
run;
```

| Obs | name    | rating |
| --- | ------- | ------ |
| 1   | Lincoln | 9      |
| 2   | Lincoln | 8      |
| 3   | Lincoln | 9      |
| 4   | Amour   | 9      |
| 5   | Argo    | 5      |
| 6   | Argo    | 10     |

The easiest thing to do would be to calculate an average rating for each movie like this:

```sas
proc sql;
  select distinct name, avg(rating) as average
    from ratings
    group by name
    order by average desc;
run;
```

| name    | average |
| ------- | ------- |
| Amour   | 9.00    |
| Lincoln | 8.67    |
| Argo    | 7.50    |

<p>But hey! That's not cool. It looks like Amour wins, because its average rating is 9. Maybe we want to consider Lincoln as better because 3 people think it's very high. A good way to deal with this is by instead taking a <a href="http://en.wikipedia.org/wiki/Bayesian_average" target="_blank">Bayesian Average</a>.</p>
<p>This means we're going to add in some "dummy" votes for each movie, who give each movie the average rating a movie gets. How many (C) is a judgement call, the more we add, the harder we make it for an obscure movie to be near the top. Likewise, if a movie's first rating is low, it keeps it from suddenly dropping to the bottom of the list. If we expect thousands of ratings for each movie, a C=1000 might be appropriate. In this example, I use a small C of 10.</p>

```sas
proc sql;
  select avg(rating) into :average
    from ratings;
  select distinct
      name,
      (sum(rating) + &average * 10) / (count(*) + 10) as b_average
    from ratings
    group by name
    order by b_average;
quit;
```

| name    | b_average |
| ------- | --------- |
| Lincoln | 8.41      |
| Amour   | 8.39      |
| Argo    | 8.19      |

And look! Lincoln is back on top, since its bayesian average more closely reflects a product of the number of ratings it has and what those ratings are.
