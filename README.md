app/
  api/
    auth/
      users/
        [userId]/
          route.ts
          status/
            route.ts
          role/
            route.ts
          reset-password/
            route.ts
        route.ts
      roles/
        route.ts

        


<!-- routes for client management in website cms to show clients on company website through portal -->
routes for frontend
/cms/clients - D
/cms/clients/new -D

backend apis
/api/clients : GET - D
/api/clients : POST - D
/api/clients/[id] : GET - D
/api/clients/[id] : DELETE - D


cmsClientsServices.tsx

1- CTO will confirm completion of project in projects list(by getting projects from the following GET api and these will be those who has projectStatus value to COMPLETED) by setting projectStatus value to ALL_STAGES_COMPLETED
APIs:
/api/manage-projects/completion-confirmation : GET
/api/manage-projects/completion-confirmation : PATCH

frontend routes:
/project-completion-confirmation

2- After CTO approval CFO sees that project in project list(by getting projects from the following GET api and these will be those who has projectStatus value to ALL_STAGES_COMPLETED) in Project Payments section where he can update the paymentStatus of project as ["PENDING", "RECIEVED", "NOT_RECIEVED"]
APIs:
/api/manage-projects/payment-status : GET
/api/manage-projects/payment-status : PATCH

frontend routes:
/project-payments


