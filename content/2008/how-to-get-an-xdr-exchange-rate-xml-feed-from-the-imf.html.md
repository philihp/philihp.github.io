---
title: "How to get an XDR Exchange Rate XML feed from the IMF"
date: 2008-10-08
tags:
  - "IMF"
  - "Programming"
  - "XDR"
author: "Philihp Busby"
---

<p>
  There's a currency used by the IMF called the
  <a href="http://en.wikipedia.org/wiki/Special_Drawing_Rights"
    >Special Drawing Right</a
  >
  (XDR), which is a unit of currency that floats at a value relative to all
  other currencies weighted by the strengths of their country's economy. In a
  world where the
  <a
    href="http://www.foreignaffairs.org/20070501faessay86308-p10/benn-steil/the-end-of-national-currency.html"
    >USD wanes in strength</a
  >, it's as close to a global currency as we've got right now.
</p>
<p></p>
<p>
  By running the following two commands, you should end up with a file rates.xml
  filled with exchange rates into XDR for the last 30 days.
</p>
<p></p>
<pre>
wget \
  -O/tmp/rates.html \
  --no-cache \
  --save-cookies=cookies.txt \
  --keep-session-cookies \
  "http://www.imf.org/external/np/fin/ert/GUI/Pages/Report.aspx?CU='EUR','JPY','GBP','USD','ARS','AUD','ATS','BHD','BEF','VEF','BWP','BRL','BND','CAD','CLP','CNY','COP','CYP','CZK','DKK','DEM','FIM','FRF','GRD','HUF','ISK','INR','IDR','IRR','IEP','ILS','ITL','KZT','KRW','KWD','LYD','LUF','MYR','MTL','MUR','MXN','NPR','NLG','NZD','NOK','PKR','PLN','PTE','QAR','OMR','RUB','SAR','SGD','SKK','SIT','ZAR','ESP','LKR','SEK','CHF','THB','TTD','AED','VEB'&EX=SDRC&P=Last30Days&CF=UnCompressed&CUF=Period&DS=Ascending&DT=Blank"
wget \
  -O/tmp/rates.xml \
  --no-cache \
  --load-cookies=cookies.txt \
  --keep-session-cookies \
  "http://www.imf.org/external/np/fin/ert/GUI/Pages/ReportData.aspx?Type=XML"
</pre>
