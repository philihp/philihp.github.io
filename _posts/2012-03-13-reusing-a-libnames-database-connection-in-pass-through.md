---
layout: post
title: Using a SAS LIBNAME's connection in Pass-through
date: 2012-03-13 21:36:55.000000000 -07:00
tags:
  - "9.3"
  - database
  - pass-through
  - Programming
  - SAS
  - SQL
  - using
  - what's new

redirect_from:
  - /blog/2012/reusing-a-libnames-database-connection-in-pass-through/
---

<p>New to SAS 9.3 is the ability of Proc SQL's ability to reuse the database connection from a LIBNAME statement in a direct pass-through query.</p>
<blockquote><p>
<a href="http://support.sas.com/documentation/cdl/en/whatsnew/64209/HTML/default/viewer.htm#sqlprocwhatsnew93.htm">Ability to Reuse the LIBNAME Statement Database Connection</a><br />
The database connection that is established with the LIBNAME statement can be reused in the CONNECT statement. The keyword USING has been added to implement this feature.</p></blockquote>
<p>The syntax is really simple, too. Where before, you may have done something like this:</p>

```sas
LIBNAME myoralib ORACLE USER="myapp" PASSWORD="mYaPPp4$$" PATH=dev;
/* ...some code that does stuff with datasets in myoralib... */

PROC SQL;
  CONNECT TO oracle AS myoralib(USER="myapp" PASSWORD="mYaPPp4$$" PATH=dev);
  CREATE TABLE dual AS
    SELECT * FROM CONNECTION TO myoralib (
       SELECT * FROM DUAL
    );
  DISCONNECT FROM myoralib;
QUIT;
```

<p>Just replace that with <a href="http://support.sas.com/documentation/cdl/en/sqlproc/63043/HTML/default/viewer.htm#n0dvpyfvarx8cun1xif861xhh3k5.htm">the new "USING" keyword</a>. Now it's just this:</p>

```sas
LIBNAME myoralib ORACLE USER="myapp" PASSWORD="mYaPPp4$$" PATH=dev;
/* ...some code that does stuff with datasets in myoralib... */

PROC SQL;
  CONNECT USING myoralib;
  CREATE TABLE dual AS
    SELECT * FROM CONNECTION TO myoralib (
       SELECT * FROM DUAL
    );
  DISCONNECT FROM myoralib;
QUIT;
```

<p>This means you only have to have your login credentials once in a SAS job which needs to execute queries native to the database, or execute binary Oracle packages or what have you. You may even be constrained by this, such as if you are inside of a Data Integration Studio job which generates the LIBNAME statement from Metadata, and you don't have access to the password. Since you're able to send a native passthrough using that connection, you don't have to hardcode the password in the job.</p>
