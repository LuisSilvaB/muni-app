"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Settings,
  UserCheck,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return null;
  }

  const stats = [
    {
      title: "Empleados",
      value: "0",
      description: "Personal activo",
      icon: Users,
      color: "bg-teal-100 text-teal-600",
      href: "/dashboard/employees",
    },
    {
      title: "Documentos",
      value: "0",
      description: "Trámites registrados",
      icon: FileText,
      color: "bg-emerald-100 text-emerald-600",
      href: "/dashboard/documents",
    },
    {
      title: "Áreas",
      value: "0",
      description: "Departamentos",
      icon: Building2,
      color: "bg-purple-100 text-purple-600",
      href: "/dashboard/areas",
    },
    {
      title: "Informes",
      value: "0",
      description: "Reportes generados",
      icon: BarChart3,
      color: "bg-amber-100 text-amber-600",
      href: "/dashboard/reports",
    },
  ];

  const quickActions = [
    {
      title: "Nuevo Trámite",
      description: "Registrar documento",
      icon: ClipboardList,
      href: "/dashboard/documents/new",
      color: "bg-teal-600 hover:bg-teal-700",
    },
    {
      title: "Registrar Empleado",
      description: "Agregar personal",
      icon: UserCheck,
      href: "/dashboard/employees/new",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Ver Calendario",
      description: "Eventos y tareas",
      icon: Calendar,
      href: "/dashboard/calendar",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-slate-600 hover:bg-slate-700",
    },
  ];

  const recentActivities = [
    {
      title: "Trámite #1234 aprobado",
      description: "Licencia de funcionamiento",
      time: "Hace 2 horas",
      icon: FileText,
      color: "text-emerald-600",
    },
    {
      title: "Nuevo empleado registrado",
      description: "Juan Pérez - Área de tesorería",
      time: "Ayer",
      icon: UserCheck,
      color: "text-teal-600",
    },
    {
      title: "Informe mensual generado",
      description: "Resumen de actividades",
      time: "Hace 2 días",
      icon: BarChart3,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bienvenido, {user.name || user.email.split("@")[0]}
        </h1>
        <p className="text-slate-600 mt-2">
          Panel de control de la municipalidad
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                Accesos Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${action.color}`}
                      >
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {action.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                Actividad Reciente
              </CardTitle>
              <Link
                href="/dashboard/activity"
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Ver todo <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 ${activity.color}`}
                    >
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Trámites Pendientes</p>
                <p className="text-3xl font-bold mt-1">12</p>
                <p className="text-teal-100 text-xs mt-2">Atención</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Ingresos del Mes</p>
                <p className="text-3xl font-bold mt-1">S/ 0</p>
                <p className="text-emerald-100 text-xs mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> registrados
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Eventos del Mes</p>
                <p className="text-3xl font-bold mt-1">5</p>
                <p className="text-purple-100 text-xs mt-2">programados</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
