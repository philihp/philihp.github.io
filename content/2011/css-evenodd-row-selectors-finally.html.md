---
title: "CSS even/odd row selectors! Finally!"
date: 2011-04-15
tags:
  - "cross-browser"
  - "css"
  - "even"
  - "HTML"
  - "odd"
  - "Programming"
  - "selector"
  - "tables"
author: "Philihp Busby"
---

<p>IE9 has been released, and it finally includes the "nth-child" pseudo-selector in CSS! In the past, this has been done on a server side, or with javascript. Now we finally have simple CSS rules for rows in tables that highlight every even or odd row, and it works in every browser without any hacks.</p>
<pre lang="css">tr:nth-child(odd) {
  background-color: #def;
}
tr:nth-child(even) {
  background-color: #fff;
}</pre>
<p><!-- i'm doing this the hard way so it works in IE8 --></p>
<table border="1" cellspacing="0" cellpadding="4">
<tr style="background-color: beige">
<th>Browser</th>
<th>Release Date</th>
</tr>
<tr style="background-color: #def">
<td>IE1</td>
<td>April 16, 1995</td>
</tr>
<tr style="background-color: #fff">
<td>IE2</td>
<td>November 22, 1995</td>
</tr>
<tr style="background-color: #def">
<td>IE3</td>
<td>August 13, 1996</td>
</tr>
<tr style="background-color: #fff">
<td>IE4</td>
<td>September 15, 1997</td>
</tr>
<tr style="background-color: #def">
<td>IE5</td>
<td>March 18, 1999</td>
</tr>
<tr style="background-color: #fff">
<td>IE6</td>
<td>August 27, 2001</td>
</tr>
<tr style="background-color: #def">
<td>IE7</td>
<td>October 18, 2006</td>
</tr>
<tr style="background-color: #fff">
<td>IE8</td>
<td>March 19, 2009</td>
</tr>
<tr style="background-color: #def">
<td>IE9</td>
<td>March 14, 2011</td>
</tr>
</table>
