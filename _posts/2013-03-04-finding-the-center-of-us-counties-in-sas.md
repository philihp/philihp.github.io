---
layout: post
title: Finding the Center of US Counties in SAS
tags:
  - centroid
  - data step
  - geometry
  - maps
  - proc sql
  - Programming
  - SAS
redirect_from:
  - /blog/2013/finding-the-center-of-us-counties-in-sas/
---

I had a problem where I needed the center longitude and latitude of each US
county. [SAS comes with some datasets containing map
data](http://support.sas.com/documentation/cdl/en/graphref/65389/HTML/default/viewer.htm#n0i4k2s0dkf6n8n15222j3gi07o8.htm)
in the format of tables that trace a line around the borders of counties. I was
interested in the
[MAPSGFK.US_COUNTIES](http://support.sas.com/documentation/cdl/en/graphref/65389/HTML/default/viewer.htm#n17k5bnax0zd6qn1p4qvzgd8uz2d.htm)
dataset, which has data that looks like this:

<img
  src="{{ post.baseurl }}/assets/uscounties.png"
  alt=""
  title="US Counties Table"
  width="500"
  class="alignnone size-full wp-image-1209"
/>

The State and County numbers were
[FIPS codes](http://en.wikipedia.org/wiki/FIPS_county_code), which
were also stored in the US_COUNTIES_ATTR table, so those are easy enough to
figure out. Segment <i>seemed</i> to be always 1. Resolution and Density were
numbers that I figured had to do with how much detail the drawing would have
if these points were used in a line drawing.

The longitude and latitude here are all points along the border. The simplest,
and most incorrect way of getting the center of the county would be to take an
average of them, which would be fine for rectangular counties, but for
territories where one side is flat (and has few waypoints) and one side is
jagged (such as a coastal border), the midpoint will be weighted to that side.
So instead, use geometry.

In geometry, there's a formula for the
[Centroid of a polygon](http://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon). This is a magic formula that I just trust is correct, because everything on
Wikipedia is true, without exception. Here was my first pass at an
implementation of it in SAS:

```sas
proc sort data=mapsgfk.us_counties out=centroids;
  by state county;
run;
data centroids(keep=cx cy county state);
  retain yi yj xi xj a cx cy x0 y0 0;
  set centroids(keep=state county lat long rename=(lat=yj long=xj));
  by state county;
  if(first.county) then do;
    cx = 0;
    cy = 0;
    a = 0;
    x0 = xj;
    y0 = yj;
  end;
  else if(not first.county) then do;
    ta = (xi*yj - xj*yi);
    cx + ((xi+xj)*ta);
    cy + ((yi+yj)*ta);
    a + ta;
  end;
  if(last.county) then do;
    ta = (xj*y0 - x0*yj);
    cx + ((xj+x0)*ta);
    cy + ((yj+y0)*ta);
    a  = ta + a * 0.5;
    cx = cx / (6*a);
    cy = cy / (6*a);
    output;
  end;
  xi = xj;
  yi = yj;
run;
```

Here, <i>xi</i> and <i>yi</i> are always the coordinates from the previous
point, and "<code>if not first.county</code>" prevents processing of the first
point of a county because it didn't have a previous point. The variables
<i>a</i>, <i>cx</i>, and <i>cy</i> accumulate for every point. The variable
<i>ta</i> is the area of the rectangle defined by the two points. Once all the
points have been accumulated, the area is halfed so it's the actual area, and
the area is used in calculating the centroid (<i>cx</i> and <i>cy</i>).

<img
  src="{{ post.baseurl }}/assets/pass1.png"
  alt=""
  title="pass1"
  width="440"
  height="173"
  class="aligncenter size-full wp-image-1215"
/>

But then I noticed the 2nd county was positioned somewhere in the
mid-Atlantic. Something had to be up. Looking closer, this was
[Baldwin County](http://en.wikipedia.org/wiki/Baldwin_County,_Alabama), which had an island. Looking at the source data, this segment was drawn in
two segments, which caused the centroid formula to choke, as it assumed
contiguous shapes. So instead, in my second pass, I compute the centroid of
every segment, then average them weighted by their areas.

```sas
proc sort data=mapsgfk.us_counties out=centroids;
  by state county segment;
run;
data centroids_temp;
  retain yi yj xi xj a cx cy x0 y0 0;
  set centroids(keep=state county segment lat long rename=(lat=yj long=xj));
  by state county segment;
  if(first.segment) then do;
    cx = 0;
    cy = 0;
    a = 0;
    x0 = xj;
    y0 = yj;
  end;
  else if(not first.segment) then do;
    ta = (xi*yj - xj*yi);
    cx + ((xi+xj)*ta);
    cy + ((yi+yj)*ta);
    a + ta;
  end;
  if(last.segment) then do;
    ta = (xj*y0 - x0*yj);
    cx + ((xj+x0)*ta);
    cy + ((yj+y0)*ta);
    a  = ta + a * 0.5;
    cx = cx / (6*a);
    cy = cy / (6*a);
    output;
  end;
  xi = xj;
  yi = yj;
run;
proc sql;
  create table centroid_weight as
  select
    state, county, sum(a) as sum
  from centroids_temp
    group by state, county;
quit;
proc sql;
  create table centroids as
  select a.state, a.county,
         sum(cx*(a / sum)) as lat,
         sum(cy*(a / sum)) as long
    from centroids_temp a
    inner join centroid_weight b
      on (a.state = b.state and a.county = b.county)
    group by a.state, a.county;
quit;
proc sql;
  drop table centroids_temp;
  drop table centroid_weight;
quit;
```

Here, I add two more steps. The first proc SQL block sums up the total area of
each county, which is used in the second block to find the average centroid of
each county's centroids, weighted by the total area that centroid represents,
which gives us correct centroids for counties drawn in multiple segments.

<img
  src="{{ post.baseurl }}/assets/pass2.png"
  alt=""
  title="pass2"
  width="438"
  height="284"
  class="alignnone size-full wp-image-1219"
/>
