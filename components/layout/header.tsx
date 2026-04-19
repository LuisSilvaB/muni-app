"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type RootWithMain = {
  id: string;
  name: string;
  isMain?: boolean;
};
type BranchWithMain = {
  id: string;
  name: string;
  isMain?: boolean;
};

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Button } from "@/components/ui/button";

export function Header() {
  const {
    user,
    signOut,
    roots,
    branches,
    selectedRootId,
    selectedBranchId,
    setSelectedRoot,
    setSelectedBranch,
    setRoots,
    setBranches,
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
        setBranches([]);
        return;
      }

      try {
        const branchesResponse = await fetch(
          `/api/branches?rootId=${selectedRootId}`,
        );
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          const branches = branchesData.branches || [];
          setBranches(branches);

          if (!selectedBranchId) {
            const mainBranch = branches.find((b: BranchWithMain) => b.isMain);
            if (mainBranch) {
              setSelectedBranch(mainBranch.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    }

    fetchBranches();
  }, [selectedRootId, setBranches, setSelectedBranch]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetch("/api/auth/logout", { method: "POST" });
    signOut();
    router.push("/");
  };

  const selectedRoot = roots.find((r) => r.id === selectedRootId);
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 leading-tight">
              {selectedRoot?.name || "Sin empresa"}
            </span>
            <span className="text-xs text-slate-500 leading-tight">
              {selectedBranch?.name || "Todas las sucursales"}
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
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
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