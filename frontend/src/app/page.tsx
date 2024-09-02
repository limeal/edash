import { getModules } from "@/actions/modules";
import { ModulesTable } from "@/components/modules/modules.table";
import Header from "@/components/shell/header";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const modules = await getModules();
  const student = searchParams.student as string || undefined;

  return <ModulesTable items={modules} student={student} />;
}
