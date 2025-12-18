'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  Heart, 
  Music, 
  Play, 
  Trash2, 
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SidebarContent } from '@/components/sidebar'
import { getFavorites, toggleFavorite, FavoriteSong } from '@/lib/api/favourites'
import { useAuth } from '@/lib/auth-context'

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function FavoriteCard({
  favorite,
  onRemove,
  isRemoving,
}: {
  favorite: FavoriteSong
  onRemove: (songId: number) => void
  isRemoving: boolean
}) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0">
              {favorite.song.coverUrl ? (
                <img
                  src={favorite.song.coverUrl}
                  alt={favorite.song.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Music className="w-6 h-6 text-primary/60" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{favorite.song.title}</h3>
              <Link
                href={`/perfil/${favorite.song.artist.id}`}
                className="text-sm text-muted-foreground hover:underline truncate block"
              >
                {favorite.song.artist.name}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                {favorite.song.genre && (
                  <Badge variant="secondary" className="text-xs">
                    {favorite.song.genre}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Salvo em {formatDate(favorite.savedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {favorite.song.url && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={favorite.song.url} target="_blank" rel="noopener noreferrer">
                    <Play className="w-4 h-4" />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowRemoveDialog(true)}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover dos favoritos</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover "{favorite.song.title}" dos seus favoritos?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onRemove(favorite.song.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
      <p className="text-muted-foreground mb-4">
        Salve musicas que voce gosta para encontra-las facilmente
      </p>
      <Button asChild>
        <Link href="/dashboard">Explorar Feed</Link>
      </Button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-5 w-20 bg-muted rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function FavoritosPage() {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteSong[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState<string | null>(null)

  const loadFavorites = async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const response = await getFavorites(20, offset)
      if (response.success && response.data) {
        setFavorites((prev) =>
          append ? [...prev, ...response.data!.favorites] : response.data!.favorites
        )
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
      loadFavorites()
    }
  }, [isAuthenticated])

  const handleRemove = async (songId: number) => {
    setRemovingId(songId)
    try {
      const response = await toggleFavorite(songId)
      if (response.success && !response.data?.isFavorite) {
        setFavorites((prev) => prev.filter((f) => f.song.id !== songId))
        setTotal((t) => t - 1)
      }
    } finally {
      setRemovingId(null)
    }
  }

  // extract unique genres
  const genres = [...new Set(favorites.map((f) => f.song.genre).filter(Boolean))]

  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch =
      !searchQuery ||
      fav.song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fav.song.artist.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGenre = !genreFilter || fav.song.genre === genreFilter

    return matchesSearch && matchesGenre
  })

  return (
    <div className="min-h-screen bg-background">
        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <section className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Favoritos</h1>
            <p className="text-muted-foreground">
              {total > 0 ? `${total} musicas salvas` : 'Suas musicas favoritas'}
            </p>
          </section>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={genreFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGenreFilter(null)}
              >
                Todos
              </Button>
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={genreFilter === genre ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGenreFilter(genre!)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredFavorites.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-3">
                {filteredFavorites.map((favorite) => (
                  <FavoriteCard
                    key={favorite.id}
                    favorite={favorite}
                    onRemove={handleRemove}
                    isRemoving={removingId === favorite.song.id}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => loadFavorites(favorites.length, true)}
                    disabled={loadingMore}
                  >
                    {loadingMore && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
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