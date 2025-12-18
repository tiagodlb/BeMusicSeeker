'use client'

import { Header } from '@/components/header'
import { SidebarContent } from '@/components/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

// Tela de carregamento simples
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isAuthenticated } = useAuth()

  // Se estiver carregando, mostra spinner
  if (isLoading) return <LoadingScreen />

  // Se não estiver logado, redireciona (ou mostra loading enquanto o middleware age)
  // Nota: Idealmente o redirecionamento acontece no Middleware ou no useEffect
  if (!isAuthenticated) return <LoadingScreen />

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">

        {/* Sidebar Desktop Fixa */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card z-50">
          <SidebarContent />
        </aside>

        {/* Wrapper do Conteúdo (Empurrado para a direita no desktop) */}
        <div className="lg:pl-64 flex flex-col min-h-screen">

          {/* Header Global */}
          <Header />

          {/* Conteúdo da Página */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full dark:text-muted-foreground">
            {children}
          </main>

        </div>
      </div>
    </ThemeProvider>
  )
}