import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link className="flex items-center gap-4" href="/">
        <Image src="/logo.jpg" alt="Epitech" width={32} height={32} />
        <h1 className="text-xl font-bold">Epitech | Info. Dashboard </h1>
      </Link>
      <nav className="flex flex-row gap-4">
        <Link href="/" className="text-white hover:underline font-bold">
          Modules
        </Link>
        <Link href="/calendar" className="text-white hover:underline font-bold">
          Calendar
        </Link>
      </nav>
    </header>
  );
}
