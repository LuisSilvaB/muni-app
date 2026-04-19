import Link from "next/link"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Gestión Inteligente
                  <span className="block text-cyan-300">Municipal</span>
                </h1>
                <p className="mt-6 text-lg text-blue-100 max-w-xl">
                  Controla y gestiona todas las operaciones municipales en una sola plataforma.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                      Comenzar gratis
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
                      Ya tengo cuenta
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl" />
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 rounded-xl p-4">
                        <div className="text-3xl font-bold">100%</div>
                        <div className="text-blue-100 text-sm">Gestión integral</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4">
                        <div className="text-3xl font-bold">24/7</div>
                        <div className="text-blue-100 text-sm">Acceso disponible</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4">
                        <div className="text-3xl font-bold">100%</div>
                        <div className="text-blue-100 text-sm">Datos seguros</div>
                      </div>
                      <div className="bg-white/20 rounded-xl p-4">
                        <div className="text-3xl font-bold">0</div>
                        <div className="text-blue-100 text-sm">Complejidad</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Todo lo que necesitas</h2>
              <p className="mt-4 text-lg text-slate-600">Herramientas diseñadas para la gestión municipal</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Gestión Centralizada</h3>
                <p className="text-slate-600">Administra todos los departamentos desde una sola plataforma.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Reportes y Análisis</h3>
                <p className="text-slate-600">Visualiza estadísticas y genera reportes detallados.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Multi-usuario</h3>
                <p className="text-slate-600">Gestiona permisos y accesos diferenciados por rol.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold">¿Listo para comenzar?</h2>
            <p className="mt-4 text-lg text-slate-300">Únete a otros municipios que ya están mejorando su gestión.</p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Empezar ahora - Es gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="font-bold text-white">Muni App</span>
              </div>
              <p className="text-sm">© 2024 Muni App. Gestión municipal inteligente.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}