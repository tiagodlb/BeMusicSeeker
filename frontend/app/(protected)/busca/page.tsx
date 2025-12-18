// app/busca/page.tsx
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Music, User, Loader2, Search as SearchIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { search, type SearchResults } from '@/lib/api/explore'
import { resolveCoverUrl } from '@/utils/image'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const performSearch = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await search(query, 'all')
        if (response.success && response.data) {
          setResults(response.data)
        } else {
          setError(response.error || 'Erro ao buscar')
        }
      } catch (err) {
        setError('Erro ao realizar busca')
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query])

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Busque por músicas ou artistas</h2>
        <p className="text-muted-foreground max-w-md">
          Digite algo na barra de pesquisa para começar a explorar
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
        <p className="text-destructive">{error}</p>
      </Card>
    )
  }

  if (!results) return null

  const totalResults = (results.users?.length || 0) + (results.songs?.length || 0)

  if (totalResults === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <SearchIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h2>
        <p className="text-muted-foreground max-w-md">
          Tente buscar por outros termos ou verifique a ortografia
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Resultados para "{query}"
        </h1>
        <p className="text-sm text-muted-foreground">
          {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({totalResults})
          </TabsTrigger>
          <TabsTrigger value="users">
            Usuários ({results.users?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="songs">
            Músicas ({results.songs?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {results.users && results.users.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Usuários
              </h2>
              <div className="grid gap-4">
                {results.users.map(user => (
                  <Link key={user.id} href={`/perfil/${user.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{user.name}</h3>
                              {user.isArtist && (
                                <Badge variant="secondary" className="text-xs">
                                  Artista
                                </Badge>
                              )}
                            </div>
                            {user.bio && (
                              <p className="text-sm text-muted-foreground truncate">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.songs && results.songs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" />
                Músicas
              </h2>
              <div className="grid gap-4">
                {results.songs.map(song => (
                  <Card key={song.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border flex items-center justify-center shrink-0 overflow-hidden">
                          {song.coverUrl ? (
                            <img
                              src={resolveCoverUrl(song.coverUrl) || ''}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Music className="w-6 h-6 text-primary/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{song.title}</h3>
                          <Link 
                            href={`/perfil/${song.artist.id}`}
                            className="text-sm text-muted-foreground hover:underline block truncate"
                          >
                            {song.artist.name}
                          </Link>
                          <Badge variant="outline" className="text-xs mt-1">
                            {song.genre}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          {results.users && results.users.length > 0 ? (
            <div className="grid gap-4">
              {results.users.map(user => (
                <Link key={user.id} href={`/perfil/${user.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{user.name}</h3>
                            {user.isArtist && (
                              <Badge variant="secondary" className="text-xs">
                                Artista
                              </Badge>
                            )}
                          </div>
                          {user.bio && (
                            <p className="text-sm text-muted-foreground truncate">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum usuário encontrado
            </p>
          )}
        </TabsContent>

        <TabsContent value="songs" className="mt-6">
          {results.songs && results.songs.length > 0 ? (
            <div className="grid gap-4">
              {results.songs.map(song => (
                <Card key={song.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border flex items-center justify-center shrink-0 overflow-hidden">
                        {song.coverUrl ? (
                          <img
                            src={resolveCoverUrl(song.coverUrl) || ''}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music className="w-6 h-6 text-primary/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <Link 
                          href={`/perfil/${song.artist.id}`}
                          className="text-sm text-muted-foreground hover:underline block truncate"
                        >
                          {song.artist.name}
                        </Link>
                        <Badge variant="outline" className="text-xs mt-1">
                          {song.genre}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma música encontrada
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
    </div>
  )
}