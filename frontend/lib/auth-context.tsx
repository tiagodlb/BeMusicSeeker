'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api, type UserData } from '@/lib/api'

type AuthState = {
  user: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const PUBLIC_ROUTES = ['/', '/entrar', '/cadastro', '/recuperar-senha']

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const fetchUser = useCallback(async () => {
    try {
      console.log('[AUTH] fetchUser chamado')
      const res = await api.users.getMe()
      console.log('[AUTH] getMe response:', res)
      
      // A resposta agora é { success: true, data: { ...userData, stats: {...} } }
      if (res.data?.success && res.data?.data) {
        console.log('[AUTH] usuário autenticado:', res.data.data)
        setState({
          user: res.data.data,
          isLoading: false,
          isAuthenticated: true,
        })
        return true
      }
      
      console.log('[AUTH] sem dados de usuário válidos')
      setState({ user: null, isLoading: false, isAuthenticated: false })
      return false
    } catch (err) {
      console.error('[AUTH] erro no fetchUser:', err)
      setState({ user: null, isLoading: false, isAuthenticated: false })
      return false
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    if (state.isLoading) return

    const isPublic = PUBLIC_ROUTES.includes(pathname)

    if (!state.isAuthenticated && !isPublic) {
      router.replace(`/entrar?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router])

  const login = useCallback(
    async (email: string, password: string) => {
      console.log('[AUTH] login chamado com:', email)
      const res = await api.auth.signIn({ email, password })
      console.log('[AUTH] signIn response:', res)

      if (res.error) {
        console.error('[AUTH] erro no signIn:', res.error)
        return { success: false, error: res.error.message }
      }

      console.log('[AUTH] signIn ok, buscando usuário...')
      const userFetched = await fetchUser()
      console.log('[AUTH] fetchUser result:', userFetched)
      return { success: userFetched }
    },
    [fetchUser]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      console.log('[AUTH] register chamado:', { name, email })
      const signUpRes = await api.auth.signUp({ name, email, password })
      console.log('[AUTH] signUp response:', signUpRes)

      if (signUpRes.error) {
        console.error('[AUTH] erro no signUp:', signUpRes.error)
        return { success: false, error: signUpRes.error.message }
      }

      console.log('[AUTH] signUp ok, fazendo login automático...')
      // login automático após cadastro
      const signInRes = await api.auth.signIn({ email, password })
      console.log('[AUTH] signIn após cadastro:', signInRes)

      if (signInRes.error) {
        console.error('[AUTH] erro no signIn após cadastro:', signInRes.error)
        return { success: false, error: signInRes.error.message }
      }

      console.log('[AUTH] login ok, buscando usuário...')
      const userFetched = await fetchUser()
      console.log('[AUTH] fetchUser result:', userFetched)
      return { success: userFetched }
    },
    [fetchUser]
  )

  const logout = useCallback(async () => {
    await api.auth.signOut()
    setState({ user: null, isLoading: false, isAuthenticated: false })
    router.replace('/entrar')
  }, [router])

  const refresh = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refresh,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { AuthContext }