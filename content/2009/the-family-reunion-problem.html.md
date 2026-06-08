---
title: "The Family Reunion Problem"
date: 2009-10-07
tags:
  - "Uncategorized"
author: "Philihp Busby"
---

<p>Here's an interesting problem. I would like to call this the family reunion problem. As far as I know, this problem hasn't  been stated or generalized anywhere else. But maybe it has?</p>
<p>Suppose a set of people live in different cities and wish to have a reunion. They're fairly far apart such that they'll be flying, cost is an issue. Everyone is indifferent as to the city, but they wish to minimize the total travel cost of the trip.</p>
<p>The family consists of the following people:</p>
<ul>
<li>Alice living in Boston</li>
<li>Bobby living in Miami</li>
<li>Cindy living in Los Angeles</li>
<li>David living in Seattle</li>
<li>Euclid living in San Francisco</li>
</ul>
<p>Costs to fly between each city are given in this matrix:</p>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<th></th>
<th>BOS</th>
<th>MIA</th>
<th>LAX</th>
<th>SEA</th>
</tr>
<tr>
<th>SFO</th>
<td>218</td>
<td>233</td>
<td>98</td>
<td>98</td>
</tr>
<tr>
<th>SEA</th>
<td>218</td>
<td>238</td>
<td>138</td>
</tr>
<tr>
<th>LAX</th>
<td>218</td>
<td>283</td>
</tr>
<tr>
<th>MIA</th>
<td>168</td>
</tr>
</tbody>
</table>
<p>Which member of the family should host the reunion?</p>
<p>Of course this is easy with just 4 people, but family reunions usually have many times this. And family reunions don't necessarily have to be held in a home city; it could be an entirely new venue.</p>
<p>My intuition tells me this is <a href="http://en.wikipedia.org/wiki/NP_(complexity)" target="_blank">NP-Complete</a>, but it has been a while.</p>
