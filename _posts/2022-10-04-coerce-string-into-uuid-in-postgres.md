---
layout: post
title: Coerce a string into a uuid in Postgres
date: 2021-10-06T00:12:00Z
categories: []
tags:
  - sql
  - postgres
  - uuid
  - segment
---

From one of my data sources, Segment, gives me event data with a GUID/UUID that looked like this when I queried it

| id                                   | received_at                |
| :----------------------------------- | :------------------------- |
| DA588117-0F6A-41AA-B0B0-D0DA20F21745 | 2022-10-04 19:51:04.271+00 |
| 4ca41477-a9ed-4ea2-a357-7ba5c19cc27c | 2022-10-04 19:46:49.421+00 |
| CDB9B507-44BC-4BEE-B9D8-3D230C59FF01 | 2022-10-04 19:45:45.545+00 |
| 783236a1-1a50-4191-a4f6-fceca77fc991 | 2022-10-04 19:45:41.645+00 |
| BC6C1BC0-02D4-461A-9EDD-EBF98BF47574 | 2022-10-04 19:45:28.542+00 |
| 43F3C421-6CA9-40E0-AA79-AD36A85D5EF5 | 2022-10-04 19:45:19.204+00 |
| F45C4B33-40CC-422F-B5F5-1982155656F7 | 2022-10-04 19:44:59.033+00 |
| 890b2d6b-6383-4af9-a556-ab9480ffc963 | 2022-10-04 19:44:54.164+00 |
| 7570242a-c646-4224-836a-73637e7bbeeb | 2022-10-04 19:44:54.164+00 |
| 26a14851-daee-4aee-b13d-08b06ea24287 | 2022-10-04 19:44:54.164+00 |
| DE32C925-1528-4008-A404-DD38307C6138 | 2022-10-04 19:44:38.161+00 |

Querying this table was slow, resulting in dashboard views that took 60+ seconds to load, and I wanted a quick win to reduce the size of it. Interestingly, the casing wasn't consistent, but that shouldn't matter.

```sql
CREATE TABLE tmp_raw_table
SELECT
    id as event_id,
    received_at
  FROM segment.event
  LIMIT 100000;
SELECT pg_size_pretty( pg_total_relation_size('tmp_raw_table') );

CREATE TABLE tmp_raw_uuid
SELECT
    id::uuid as event_id,
    received_at
  FROM segment.event
  LIMIT 10000000;
SELECT pg_size_pretty( pg_total_relation_size('tmp_uuid_table') );
```

Running this to test my syntax, and the reported size of the differences in tables goes from 7488 kB to 5096 kB. Not bad for something as low-effort as coercing a type, so I tried to ship it to the full table, and then it failed...

```
ERROR:  invalid input syntax for type uuid: "0qREGUQhbFNoRd-aeFacw"
```

In my experience, halting functions like these are nasty when used in a production ETL flow, because one bit of bad data upstream will break the whole build. Here, it sounds like at some point they went from a random string to a legit UUID, and I wanted a similarly low-effort way of just making it so while preserving the uniqueness. [This post](https://stackoverflow.com/a/21327318/643928) had a good snippet, so I turned that into a database function.

```sql
CREATE OR REPLACE FUNCTION to_uuid(raw text)
  RETURNS uuid IMMUTABLE STRICT
AS $$
  BEGIN
    RETURN raw::uuid;
  EXCEPTION WHEN invalid_text_representation THEN
    RETURN uuid_in(overlay(overlay(md5(raw) placing '4' from 13) placing '8' from 17)::cstring);
  END;
$$ LANGUAGE plpgsql;
```

There are a lot of good reasons to avoid database functions, but I think as long as they're very concise, it shouldn't be any more annoying than using built-in functions. I added that `IMMUTABLE` bit to make sure it's deterministic and fast/safe to use in indexes.

```sql
CREATE TABLE tmp_raw_uuid
SELECT
    to_uuid(id) as event_id,
    received_at
  FROM segment.event
  LIMIT 10000000;
SELECT pg_size_pretty( pg_total_relation_size('tmp_uuid_table') );
```
