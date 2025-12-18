'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu,
  Search,
  Bell,
  Settings,
  Compass,
  Users,
  Music,
  TrendingUp,
  Loader2,
  ThumbsUp,
  MessageCircle,
  UserPlus,
  Hash,
  AlertCircle,
  RefreshCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Note: Removi Sheet e SidebarContent pois devem estar no Layout, 
// mas se você ainda não moveu, mantenha-os ou use o ProtectedLayout sugerido antes.
import {
  getExploreData,
  search as searchApi,
  ExploreData,
  ExploreUser,
  ExplorePost,
  SearchResults,
} from '@/lib/api/explore'
import { toggleFollow } from '@/lib/api/follows'
import { useAuth } from '@/lib/auth-context'
import { resolveCoverUrl } from '@/utils/image'

// ... mantenha as funções getInitials, UserCard, TrendingPostCard, SearchResultsView ...
function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function UserCard({
  user,
  onFollowToggle,
  isTogglingFollow,
}: {
  user: ExploreUser
  onFollowToggle: (id: number) => void
  isTogglingFollow: boolean
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Link href={`/perfil/${user.id}`}>
            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/perfil/${user.id}`}>
              <p className="font-medium truncate hover:underline">{user.name}</p>
            </Link>
            <p className="text-xs text-muted-foreground">
              {user.stats.followers} seguidores
              {user.stats.recommendations !== undefined && ` · ${user.stats.recommendations} recs`}
            </p>
          </div>
          <Button
            variant={user.isFollowing ? 'outline' : 'default'}
            size="sm"
            onClick={() => onFollowToggle(user.id)}
            disabled={isTogglingFollow}
          >
            {isTogglingFollow ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : user.isFollowing ? (
              'Seguindo'
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" />
                Seguir
              </>
            )}
          </Button>
        </div>
        {user.bio && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{user.bio}</p>
        )}
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="text-xs">
            {user.isArtist ? 'Artista' : 'Curador'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function TrendingPostCard({ post }: { post: ExplorePost }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0">
            {post.song.coverUrl ? (
              <img
                src={resolveCoverUrl(post.song.coverUrl) || ""}
                alt={post.song.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-6 h-6 text-primary/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{post.song.title}</p>
            <p className="text-sm text-muted-foreground truncate">
              por{' '}
              <Link href={`/perfil/${post.user.id}`} className="hover:underline">
                {post.user.name}
              </Link>
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {post.stats.upvotes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.stats.comments}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SearchResultsView({
  results,
  isLoading,
}: {
  results: SearchResults | null
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!results) return null

  const hasResults = results.users.length > 0 || results.songs.length > 0

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum resultado encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {results.users.length > 0 && (
        <section>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários ({results.users.length})
          </h3>
          <div className="grid gap-3">
            {results.users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <Link href={`/perfil/${user.id}`} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {user.isArtist ? 'Artista' : 'Curador'}
                      </Badge>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {results.songs.length > 0 && (
        <section>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Music className="w-4 h-4" />
            Músicas ({results.songs.length})
          </h3>
          <div className="grid gap-3">
            {results.songs.map((song) => (
              <Card key={song.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0">
                      {song.coverUrl ? (
                        <img
                          src={resolveCoverUrl(song.coverUrl) || ""}
                          alt={song.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Music className="w-4 h-4 text-primary/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{song.title}</p>
                      <Link
                        href={`/perfil/${song.artist.id}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {song.artist.name}
                      </Link>
                    </div>
                    {song.genre && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        {song.genre}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-6 w-40 bg-muted rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                  <div className="h-8 w-20 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function ExplorarPage() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<ExploreData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Novo estado de erro
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [togglingFollowId, setTogglingFollowId] = useState<number | null>(null)

  async function loadData() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getExploreData()
      if (response.success && response.data) {
        setData(response.data)
      } else {
        // Se a resposta não for sucesso, definimos o erro
        setError(response.error || 'Falha ao carregar dados do explorar')
        console.error('Explore API Error:', response.error)
      }
    } catch (err) {
      setError('Erro de conexão ao carregar dados')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ... lógica de debounce da busca (igual) ...
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true)
        try {
          const response = await searchApi(searchQuery)
          if (response.success && response.data) {
            setSearchResults(response.data)
          }
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults(null)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleFollowToggle = async (userId: number) => {
    // ... sua lógica existente de follow ...
    if (!isAuthenticated) return

    setTogglingFollowId(userId)
    try {
      const response = await toggleFollow(userId)
      if (response.success && data) {
        const updateUser = (user: ExploreUser) =>
          user.id === userId ? { ...user, isFollowing: response.data!.isFollowing } : user

        setData({
          ...data,
          popularUsers: data.popularUsers.map(updateUser),
          recentUsers: data.recentUsers.map(updateUser),
        })
      }
    } finally {
      setTogglingFollowId(null)
    }
  }

  const isShowingSearch = searchQuery.length >= 2

  return (
    <div className="min-h-screen bg-background">
        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <section className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
              <Compass className="w-6 h-6" />
              Explorar
            </h1>
            <p className="text-muted-foreground">
              Descubra novos curadores, artistas e músicas
            </p>

            {/* Input de busca local, caso não esteja usando o Header global */}
            <div className="mt-4 max-w-md">
                 <Input 
                   placeholder="Buscar usuários ou músicas..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
            </div>
          </section>

          {isShowingSearch ? (
            <SearchResultsView results={searchResults} isLoading={isSearching} />
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            // Exibição do Erro
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ops, algo deu errado</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => loadData()}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                </Button>
            </div>
          ) : data ? (
            // Exibição dos Dados (Se data existir)
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList>
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="trending">Em Alta</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-8">
                {/* Popular Users */}
                <section>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Usuários Populares
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.popularUsers.length > 0 ? data.popularUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onFollowToggle={handleFollowToggle}
                        isTogglingFollow={togglingFollowId === user.id}
                      />
                    )) : (
                        <p className="text-muted-foreground col-span-2">Nenhum usuário popular encontrado.</p>
                    )}
                  </div>
                </section>

                {/* Recent Users */}
                {data.recentUsers.length > 0 && (
                  <section>
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Novos na Plataforma
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.recentUsers.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          onFollowToggle={handleFollowToggle}
                          isTogglingFollow={togglingFollowId === user.id}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <section>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Recomendações em Alta
                  </h2>
                  {data.trendingPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.trendingPosts.map((post) => (
                        <TrendingPostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma recomendação em alta no momento
                    </p>
                  )}
                </section>

                {/* Popular Genres */}
                {data.popularGenres.length > 0 && (
                  <section>
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Gêneros Populares
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {data.popularGenres.map((g) => (
                        <Badge key={g.genre} variant="secondary" className="text-sm py-1.5 px-3">
                          {g.genre}
                          <span className="ml-1.5 text-muted-foreground">({g.count})</span>
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="tags" className="space-y-6">
                <section>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Tags Populares
                  </h2>
                  {data.popularTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.popularTags.map((t) => (
                        <Badge
                          key={t.tag}
                          variant="outline"
                          className="text-sm py-1.5 px-3 cursor-pointer hover:bg-accent"
                        >
                          #{t.tag}
                          <span className="ml-1.5 text-muted-foreground">({t.count})</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma tag encontrada
                    </p>
                  )}
                </section>
              </TabsContent>
            </Tabs>
          ) : (
            // Caso de fallback extremo (não deveria acontecer com o tratamento de erro acima)
             <div className="text-center py-12">
                 <p className="text-muted-foreground">Não foi possível carregar os dados.</p>
             </div>
          )}
        </main>
      </div>
  )
}