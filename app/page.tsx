"use client"

import { useSession } from "next-auth/react"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push('/entries');
  }

  return (
    <main className="flex h-full flex-col items-center justify-between">
      <h3 className="text-slate-500 my-10">Welcome to AI-powered Journal!</h3>
      <Link href="/api/auth/signin">
        <button className="px-5 py-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:scale-110 ease-out duration-300 rounded-2xl shadow-lg text-white font-black">
          Start Writing
        </button>
      </Link>
    </main>
  )
}
