alter table public.job_applications
add column if not exists job_offer_id uuid
references public.job_offers (id)
on delete set null;

create index if not exists job_applications_job_offer_id_idx
  on public.job_applications (job_offer_id);

update public.job_applications as applications
set job_offer_id = (
  select offers.id
  from public.job_offers as offers
  where offers.title = applications.position
  order by offers.created_at desc
  limit 1
)
where applications.job_offer_id is null;
