"use client"

import { useSession } from "next-auth/react"
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const { data: session, status, update } = useSession();

  if (status === "authenticated") {
    redirect('/entries');
  }

  return (
    <main className="flex h-full flex-col items-center justify-between">
      <h3 className="text-slate-900 dark:text-slate-200 font-thin text-xl my-10">Welcome to AI-powered Journal! 😎</h3>
      <Link href="/api/auth/signin">
        <button className="px-5 py-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:scale-110 ease-out duration-300 rounded-2xl shadow-lg text-white font-black">
          Start Writing ✍️
        </button>
      </Link>
      <div className="mt-4 underline text-xs text-gray-500 dark:text-slate-400">
        <Link href="/entries">{"See what people are writing (demo)"}</Link>
      </div>
    </main>
  )
}
