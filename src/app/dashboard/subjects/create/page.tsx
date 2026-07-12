import { PageHeader }
  from "@/components/ui/page-header";

import { CreateSubjectForm }
  from "@/components/subjects/create-subject-form";

import { getSubjectTenants }
  from "@/modules/subjects/services/get-subject-tenants.service";

import { getSubjectClasses }
  from "@/modules/subjects/services/get-subject-classes.service";

export default async function CreateSubjectPage() {
  const tenants =
    await getSubjectTenants();

  const classes =
    await getSubjectClasses();

  return (
    <>
      <PageHeader
        title="Create Subject"
        subtitle="Create a new subject for a class."
      />

      <CreateSubjectForm
        tenants={tenants}
        classes={classes}
      />
    </>
  );
}