import Image from "next/image";

export default async function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center gap-4">
        <Image src="/logo.jpg" alt="Epitech" width={32} height={32} />
        <h1 className="text-xl font-bold">Epitech | Modules Tek5</h1>
      </div>
      <div>
        Made with ❤️ by <a href="https://limeal.fr">Limeal</a>
      </div>
    </header>
  );
}
