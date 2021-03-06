export const urls = {
  users_talent_edit: 'users/talent/edit',
  admins_talent_edit: 'admins/talent/:user_id/edit',
  admins_pages_edit: 'admins/pages/:page_name/edit',
  pages: 'pages/:page_name',
  admin_talent_view: 'admins/talent/:user_id',
  company_talent_view: 'users/talent/:user_id',
  candidate_talent_view: 'users/talent',
  price_plan: 'pricing', //for general users
  company_wizard_price_plan: 'users/company/wizard/pricing', //for company wizard & edit company price plan
  admin_company_view: 'admins/company/:user_id',
  company_profile_view: 'users/company',
  //new for jobs pages
  admin_jobs_add: 'admins/company/:company_id/jobs/new',
  company_jobs_add: 'users/company/jobs/new',
  company_jobs_view: 'users/company/jobs/:job_id',
  admin_jobs_view: 'admins/company/:company_id/jobs/:job_id',
  company_edit_job: 'users/company/jobs/:job_id/edit',
  admin_edit_job: 'admins/company/:company_id/jobs/:job_id/edit'
};
