import { notFound } from "next/navigation";

import { PageHeader }
  from "@/components/ui/page-header";

import { EditSubjectForm }
  from "@/components/subjects/edit-subject-form";

import { getSubjectById }
  from "@/modules/subjects/services/get-subject-by-id.service";

import { getSubjectTenants }
  from "@/modules/subjects/services/get-subject-tenants.service";

import { getSubjectClasses }
  from "@/modules/subjects/services/get-subject-classes.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSubjectPage({
  params,
}: Props) {
  const { id } =
    await params;

  const subject =
    await getSubjectById(
      id
    );

  if (!subject) {
    notFound();
  }

  const tenants =
    await getSubjectTenants();

  const classes =
    await getSubjectClasses();

  return (
    <>
      <PageHeader
        title="Edit Subject"
        subtitle="Update subject details."
      />

      <EditSubjectForm
        id={subject.id}
        initialName={
          subject.name
        }
        initialCode={
          subject.code
        }
        initialDescription={
          subject.description ??
          ""
        }
        initialTenantId={
          subject.tenantId
        }
        initialClassId={
          subject.classId
        }
        tenants={tenants}
        classes={classes}
      />
    </>
  );
}