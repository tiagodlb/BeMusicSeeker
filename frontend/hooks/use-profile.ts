'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, type UserData, type UserStats } from '@/lib/api'

type ProfileData = UserData & {
  stats: UserStats
}

type UseProfileReturn = {
  profile: ProfileData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProfile(id: string): UseProfileReturn {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const numericId = parseInt(id)
      if (isNaN(numericId)) {
        setError('ID inválido')
        setIsLoading(false)
        return
      }

      const [userRes, statsRes] = await Promise.all([
        api.users.getById(numericId),
        api.users.getStats(numericId),
      ])

      if (userRes.error) {
        setError(userRes.error.message)
        return
      }

      setProfile({
        ...userRes.data!.data,
        stats: statsRes.data?.data ?? {
          postsCount: 0,
          songsCount: 0,
          followersCount: 0,
          followingCount: 0,
        },
      })
    } catch (err) {
      setError('Erro ao carregar perfil')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, isLoading, error, refetch: fetchProfile }
}