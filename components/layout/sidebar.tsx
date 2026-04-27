"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState, useEffect } from "react";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import {
  LayoutDashboard,
  Building2,
  Store,
  Layers,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Settings,
  Factory,
  AlertTriangle,
  Monitor,
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavCategory = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const STORAGE_KEY = "sidebar-expanded-categories";

const mainItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Estadísticas", href: "/dashboard/statistics", icon: BarChart3 },
];

const navigation: NavCategory[] = [
  {
    name: "Configuración",
    icon: Settings,
    items: [
      { name: "Municipalidades", href: "/dashboard/municipalidades", icon: Building2 },
    ],
  },
  {
    name: "Gestión",
    icon: Factory,
    items: [
      { name: "Áreas", href: "/dashboard/areas", icon: Layers },
      { name: "Dispositivos", href: "/dashboard/devices", icon: Monitor },
      { name: "Empleados", href: "/dashboard/employees", icon: Store },
      { name: "Trámites", href: "/dashboard/documents", icon: ClipboardList },
      { name: "Incidencias", href: "/dashboard/incidencias", icon: AlertTriangle },
    ],
  }
];

function useExpandedCategories(pathname: string) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial: Record<string, boolean> = {};

    if (stored) {
      try {
        Object.assign(initial, JSON.parse(stored));
      } catch {
        // keep empty
      }
    }

    navigation.forEach((cat) => {
      const hasActiveItem = cat.items.some((item) =>
        item.href === "/dashboard"
          ? pathname === item.href
          : pathname.startsWith(item.href),
      );
      if (!(cat.name in initial)) {
        initial[cat.name] = hasActiveItem || cat.items.length <= 3;
      }
    });

    setExpandedCategories(initial);
    setIsInitialized(true);
  }, [pathname]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedCategories));
    }
  }, [expandedCategories, isInitialized]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    navigation.forEach((cat) => {
      all[cat.name] = true;
    });
    setExpandedCategories(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    navigation.forEach((cat) => {
      all[cat.name] = false;
    });
    setExpandedCategories(all);
  };

  const allExpanded = Object.values(expandedCategories).every((v) => v);
  const allCollapsed = Object.values(expandedCategories).every((v) => !v);

  return {
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll,
    allExpanded,
    allCollapsed,
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const {
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll,
    allExpanded,
    allCollapsed,
  } = useExpandedCategories(pathname);

  const isItemActive = (href: string) => {
    return href === "/dashboard"
      ? pathname === href
      : pathname.startsWith(href);
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={clsx(
          "h-16 border-b border-slate-200 flex items-center flex-shrink-0",
          isCollapsed ? "justify-center px-2" : "gap-2 px-6",
        )}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        {!isCollapsed && (
          <span className="font-bold text-lg text-slate-900 whitespace-nowrap">
            Muni App
          </span>
        )}
      </div>

      {!isCollapsed && (
        <div className="flex items-center justify-end px-3 py-2 border-slate-100 gap-1">
          <button
            onClick={expandAll}
            className={clsx(
              "p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors",
              allExpanded && "opacity-30 cursor-not-allowed",
            )}
            title="Expandir todos"
            disabled={allExpanded}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={collapseAll}
            className={clsx(
              "p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors",
              allCollapsed && "opacity-30 cursor-not-allowed",
            )}
            title="Contraer todos"
            disabled={allCollapsed}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {mainItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 mx-2 mb-1 rounded-lg text-sm font-medium transition-colors",
              isItemActive(item.href)
                ? "bg-teal-50 text-teal-700"
                : "text-slate-700 hover:bg-slate-100",
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="whitespace-nowrap">{item.name}</span>
          </Link>
        ))}

        {navigation.map((category) => (
          <div key={category.name} className="mb-1">
            {!isCollapsed ? (
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </span>
                {expandedCategories[category.name] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="px-3 py-2">
                <category.icon className="h-5 w-5 text-slate-400 mx-auto" />
              </div>
            )}

            {!isCollapsed && (
              <div
                className={clsx(
                  "relative space-y-0.5 pl-4 overflow-hidden transition-all before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200",
                  expandedCategories[category.name]
                    ? "max-h-96"
                    : "max-h-0 before:top-0",
                )}
              >
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm font-medium transition-colors",
                      isItemActive(item.href)
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {isCollapsed && (
              <div className="space-y-0.5 px-2">
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-colors",
                      isItemActive(item.href)
                        ? "bg-teal-50 text-teal-700"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-2 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className={clsx(
            "w-full flex items-center justify-center rounded-lg py-2 text-slate-500 hover:bg-slate-100 transition-colors",
            isCollapsed ? "px-2" : "px-3",
          )}
          title={isCollapsed ? "Expandir" : "Colapsar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="text-xs">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}