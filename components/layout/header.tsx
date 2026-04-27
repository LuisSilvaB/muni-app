"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export function Header() {
  const {
    user,
    signOut,
    roots,
    selectedRootId,
    setRoots,
  } = useAuthStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchRoots() {
      try {
        const response = await fetch("/api/roots");
        if (response.ok) {
          const data = await response.json();
          setRoots(data.roots || []);
        }
      } catch (error) {
        console.error("Error fetching roots:", error);
      }
    }
    fetchRoots();
  }, [setRoots]);

  useEffect(() => {
    async function fetchBranches() {
      if (!selectedRootId) {
        return;
      }
    }

    fetchBranches();
  }, [selectedRootId]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetch("/api/auth/logout", { method: "POST" });
    signOut();
    router.push("/");
  };

  const selectedRoot = roots.find((r) => r.id === selectedRootId);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 leading-tight">
              {selectedRoot?.name || "Municipalidad no seleccionada"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {user.name || user.email.split("@")[0]}
                </span>
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}