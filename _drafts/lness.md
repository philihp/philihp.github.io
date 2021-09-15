-- reset every day

select 
    user_id,
    count(distinct date(received_at))
  from react_native_prod.event
  where received_at between current_date - interval '7 days' and current_date - interval '0 days'
    and user_id is not null
  group by user_id

-- continuuous windows

select 
    user_id,
    count(distinct extract(days from current_timestamp - received_at))
  from react_native_prod.event
  where received_at > current_timestamp - interval '7 days'
    and user_id is not null
  group by user_id

-- reset every week, but have back-dating


select
    user_id,
    to_char(received_at, 'IYYY-"W"IW') as iso_week_date,
    count(distinct date(received_at)) as lness
  from react_native_prod.event
    where user_id is not null
    and user_id = '4781'
--    and event_type='open the app'
  group by 1, 2
  order by 1, 2



