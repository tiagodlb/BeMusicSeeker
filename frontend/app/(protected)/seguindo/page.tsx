'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Search, Bell, Settings, Users, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { SidebarContent } from '@/components/sidebar'
import { getFollowing, toggleFollow, FollowUser } from '@/lib/api/follows'
import { useAuth } from '@/lib/auth-context'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function UserCard({
  user,
  onUnfollow,
  isLoading,
}: {
  user: FollowUser
  onUnfollow: (id: number) => void
  isLoading: boolean
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/perfil/${user.id}`}>
            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Link>
          <Badge variant="outline" className="text-xs">
            {user.isArtist ? 'Artista' : 'Curador'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Link href={`/perfil/${user.id}`}>
            <CardTitle className="text-base hover:underline cursor-pointer">
              {user.name}
            </CardTitle>
          </Link>
          {user.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {user.bio}
            </p>
          )}
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <p className="font-semibold tabular-nums">{user.stats.followers}</p>
            <p className="text-muted-foreground text-xs">Seguidores</p>
          </div>
          <div>
            <p className="font-semibold tabular-nums">{user.stats.recommendations}</p>
            <p className="text-muted-foreground text-xs">Recomendacoes</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => onUnfollow(user.id)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Deixar de Seguir
        </Button>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Voce ainda nao segue ninguem</h3>
      <p className="text-muted-foreground mb-4">
        Encontre curadores e artistas para seguir e descobrir novas musicas
      </p>
      <Button asChild>
        <Link href="/explorar">Explorar</Link>
      </Button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="w-16 h-5 bg-muted rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </div>
            <div className="flex gap-4">
              <div className="space-y-1">
                <div className="h-5 w-12 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
              <div className="space-y-1">
                <div className="h-5 w-12 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
            <div className="h-9 w-full bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function SeguindoPage() {
  const { isAuthenticated } = useAuth()
  const [users, setUsers] = useState<FollowUser[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [unfollowingId, setUnfollowingId] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'curators' | 'artists'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const loadFollowing = async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const response = await getFollowing(20, offset)
      if (response.success && response.data) {
        setUsers((prev) => (append ? [...prev, ...response.data!.users] : response.data!.users))
        setTotal(response.data.total)
        setHasMore(response.data.hasMore)
      }
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadFollowing()
    }
  }, [isAuthenticated])

  const handleUnfollow = async (userId: number) => {
    setUnfollowingId(userId)
    try {
      const response = await toggleFollow(userId)
      if (response.success && !response.data?.isFollowing) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
        setTotal((t) => t - 1)
      }
    } finally {
      setUnfollowingId(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'artists' && user.isArtist) ||
      (filter === 'curators' && !user.isArtist)

    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <section className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Seguindo</h1>
            <p className="text-muted-foreground">
              {total > 0 ? `${total} pessoas que voce segue` : 'Pessoas que voce segue'}
            </p>
          </section>

          <div className="flex gap-2 mb-6">
            {(['all', 'curators', 'artists'] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Todos' : f === 'curators' ? 'Curadores' : 'Artistas'}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredUsers.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onUnfollow={handleUnfollow}
                    isLoading={unfollowingId === user.id}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => loadFollowing(users.length, true)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
  )
}