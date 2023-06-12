"use client"

import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex h-full flex-col items-center justify-between">
      <h3 className="text-slate-500 my-10">Welcome to AI-powered Journal!</h3>
      <Link href="/entries/new">
        <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-full shadow-lg text-white">
          Write
        </button>
        <button className="ml-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-full shadow-lg text-white">
          Sign Up
        </button>
      </Link>
    </main>
  )
}
