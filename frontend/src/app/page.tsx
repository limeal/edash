import { getModules } from "@/actions/modules";
import { ModulesTable } from "@/components/modules/modules.table";
import Header from "@/components/shell/header";
import Image from "next/image";

export default async function Home() {
  const modules = await getModules();

  return (
    <>
      <Header />
      <main className="p-5">
        <ModulesTable items={modules} />
      </main>
    </>
  );
}
