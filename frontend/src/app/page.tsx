import { getModulesAndStudents } from "@/actions/modules";
import { ModulesTable } from "@/components/modules/modules.table";
import Header from "@/components/shell/header";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [modules, students] = await getModulesAndStudents();
  const student = searchParams.student as string || undefined;

  return <ModulesTable items={modules} students={students} student={student} />;
}
