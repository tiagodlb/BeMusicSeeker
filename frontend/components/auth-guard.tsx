'use client'

import { useAuth } from '@/lib/auth-context'
import { Loader2 } from 'lucide-react'

type AuthGuardProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
}

function DefaultLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  )
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return fallback ?? <DefaultLoading />
  }

  if (!isAuthenticated) {
    // redirect é tratado pelo AuthProvider
    return fallback ?? <DefaultLoading />
  }

  return <>{children}</>
}

// HOC alternativo para páginas
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthGuard fallback={LoadingComponent ? <LoadingComponent /> : undefined}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}