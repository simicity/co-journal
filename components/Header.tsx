"use client"

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';
import logo from '@/public/logo.png';

export default function EntriesPage() {
  const {data: session, status} = useSession();
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const toggleDropdownMenu = () => setShowDropdownMenu(!showDropdownMenu);

  const handleSignOut = () => {
    toggleDropdownMenu();
    signOut({ callbackUrl: '/' });
  }

  return (
    <header className="flex justify-between mb-8">
      <Link href="/">
        <Image
          src={logo}
          width={50}
          height={50}
          alt="Logo"
          style={{
            border: 'solid black 4px',
            borderRadius: '50%',
          }}
        />
      </Link>
      <div>
        <nav className="text-slate-600 dark:text-slate-300">
          <Link href="/entries/new" className="mx-2">
            <button className="font-semibold text-white text-sm bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-500 rounded-md px-3 py-2">
              New Entry
            </button>
          </Link>
          {!session && (
            <Link href="/api/auth/signin" className="mx-6">Log In</Link>
          )}
          {session && (
            <div className="relative inline-block text-left">
              <div>
                <button type="button" onClick={() => toggleDropdownMenu()} className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 dark:bg-slate-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  {session.user?.name}
                  <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                  </svg>
                </button>
              </div>
              {showDropdownMenu && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                  <div className="py-1" role="none">
                    <Link href="/entries/user" onClick={() => toggleDropdownMenu()} className="block px-4 py-2 text-sm hover:bg-slate-200 dark:hover:bg-slate-800" role="menuitem">
                      My Entries
                    </Link>
                    <Link href="#" onClick={() => toggleDropdownMenu()} className="block px-4 py-2 text-sm hover:bg-slate-200 dark:hover:bg-slate-800" role="menuitem">
                      Account settings
                    </Link>
                    <button type="submit" onClick={ handleSignOut } className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-200 dark:hover:bg-slate-800" role="menuitem">
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}