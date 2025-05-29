"use client"

import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/** Fondo */}
      <div className="fixed inset-0 -z-10 w-full h-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#7c0a02_100%)]">

        <div className="flex flex-col items-center justify-center h-full space-y-12">
          {/** Logo */}
          <div className="text-center">
            <img
              src="/Demonship_Logo_Full.png"
              alt="Logo principal demonship"
              className="mx-auto mb-12"
            />
          </div>

          <div className='border-2 border-red-500 w-1/2 mb-32'></div>

          {/** Botones */}
          <div className="flex flex-col md:flex-row gap-50 ">
            <Link href="/CharacterCreator">
              <button className="bg-black text-white border-2 border-red-500 hover:bg-red-500 hover:text-black transition duration-200 px-8 py-4 text-3xl font-mono">
                Crear personaje
              </button>
            </Link>

            <Link href="/CharacterVisualizer">
              <button className="bg-black text-white border-2 border-red-500 hover:bg-red-500 hover:text-black transition duration-200 px-8 py-4 text-3xl font-mono">
                Ver personajes
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}