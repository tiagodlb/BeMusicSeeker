'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutList,
  LayoutGrid,
  Music,
  MoreHorizontal,
  Play,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Heart,
  Loader2,
  Plus,
  ExternalLink,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  getRecommendations,
  voteRecommendation,
  type Recommendation
} from '@/lib/api/recommendations'
import { checkFavorites, toggleFavorite } from '@/lib/api/favourites'
import { CommentsDrawer } from '@/components/comments-drawer'
import { useAuth } from '@/lib/auth-context'
import { resolveCoverUrl } from '@/utils/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// --- Helpers ---

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins} min atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays < 7) return `${diffDays}d atrás`
  return date.toLocaleDateString('pt-BR')
}

// --- Player Logic ---

function getPlayerType(url: string): 'soundcloud' | 'spotify' | 'youtube' | 'external' | null {
  if (!url) return null
  if (url.includes('soundcloud.com')) return 'soundcloud'
  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.startsWith('http')) return 'external'
  return null
}

function getSoundCloudEmbedUrl(url: string): string {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`
}

function getSpotifyEmbedUrl(url: string): string | null {
  const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`
  }
  return null
}

function getYouTubeEmbedUrl(url: string): string | null {
  let videoId: string | null = null
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0]
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

function MusicPlayer({ url, title }: { url: string; title: string }) {
  const playerType = getPlayerType(url)
  const [showEmbed, setShowEmbed] = useState(false)

  if (!playerType) {
    return <div className="text-sm text-muted-foreground italic">Sem link de áudio</div>
  }

  if (playerType === 'soundcloud') {
    return (
      <div className="space-y-2 mt-2">
        {showEmbed ? (
          <iframe width="100%" height="120" scrolling="no" frameBorder="no" allow="autoplay" src={getSoundCloudEmbedUrl(url)} className="rounded-lg" />
        ) : (
          <Button variant="outline" size="sm" className="gap-2 w-full justify-start" onClick={() => setShowEmbed(true)}>
            <Play className="w-4 h-4" /> Reproduzir no SoundCloud
          </Button>
        )}
      </div>
    )
  }

  if (playerType === 'spotify') {
    const embedUrl = getSpotifyEmbedUrl(url)
    if (embedUrl) {
      return (
        <div className="space-y-2 mt-2">
          {showEmbed ? (
            <iframe src={embedUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="rounded-lg" />
          ) : (
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start" onClick={() => setShowEmbed(true)}>
              <Play className="w-4 h-4" /> Reproduzir no Spotify
            </Button>
          )}
        </div>
      )
    }
  }

  if (playerType === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(url)
    if (embedUrl) {
      return (
        <div className="space-y-2 mt-2">
          {showEmbed ? (
            <iframe src={embedUrl} width="100%" height="200" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg" />
          ) : (
            <Button variant="outline" size="sm" className="gap-2 w-full justify-start" onClick={() => setShowEmbed(true)}>
              <Play className="w-4 h-4" /> Reproduzir no YouTube
            </Button>
          )}
        </div>
      )
    }
  }

  return (
    <Button variant="outline" size="sm" className="gap-2 mt-2 w-full justify-start" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-4 h-4" /> Ouvir Externamente
      </a>
    </Button>
  )
}

// --- Components ---

function RecommendationCard({
  data,
  onVote,
  onCommentsChange,
  onFavoriteToggle,
}: {
  data: Recommendation
  onVote: (id: number, type: 'up' | 'down') => void
  onCommentsChange: (id: number, delta: number) => void
  onFavoriteToggle: (id: number, songId: number) => void
}) {
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const handleFavorite = async () => {
    setFavoriteLoading(true)
    await onFavoriteToggle(data.id, data.music.id)
    setFavoriteLoading(false)
  }

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex items-center gap-3">
          <Link href={`/perfil/${data.user.id}`}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={data.user.avatar ?? undefined} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-xs">
                {getInitials(data.user.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/perfil/${data.user.id}`} className="text-sm font-medium hover:underline block truncate">
              {data.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(data.createdAt)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleFavorite}>
                {data.isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(window.location.href)}>
                Copiar link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Denunciar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-4 px-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="w-full sm:w-32 sm:h-32 aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-purple-600/10 border flex items-center justify-center shrink-0 overflow-hidden relative group">
            {data.music.coverUrl ? (
              <img
                src={resolveCoverUrl(data.music.coverUrl) || ''}
                alt={data.music.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.classList.add('fallback-icon')
                }}
              />
            ) : (
              <Music className="w-10 h-10 text-primary/40" />
            )}
            {data.music.coverUrl && (
              <Music className="w-10 h-10 text-primary/40 hidden fallback-icon:block absolute" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div>
              <h3 className="font-semibold text-lg leading-tight truncate" title={data.music.title}>
                {data.music.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate" title={data.music.artist}>
                {data.music.artist}
              </p>
            </div>
            <MusicPlayer url={data.music.link} title={data.music.title} />
          </div>
        </div>

        <p className="text-sm mb-4 text-foreground/90 whitespace-pre-wrap">{data.description}</p>

        <div className="flex flex-wrap gap-2">
          {data.music.genre && (
            <Badge variant="outline" className="text-xs font-normal">
              {data.music.genre}
            </Badge>
          )}
          {data.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 pb-3 px-4 bg-muted/5">
        <div className="flex items-center gap-1 w-full">
          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-1.5 h-8', data.userVote === 'up' && 'text-emerald-600 bg-emerald-500/10')}
            onClick={() => onVote(data.id, 'up')}
          >
            <ThumbsUp className={cn("w-4 h-4", data.userVote === 'up' && "fill-current")} />
            <span className="tabular-nums font-medium">{data.stats.upvotes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-1.5 h-8', data.userVote === 'down' && 'text-red-600 bg-red-500/10')}
            onClick={() => onVote(data.id, 'down')}
          >
            <ThumbsDown className={cn("w-4 h-4", data.userVote === 'down' && "fill-current")} />
            <span className="tabular-nums font-medium">{data.stats.downvotes}</span>
          </Button>

          <CommentsDrawer
            postId={data.id}
            commentsCount={data.stats.comments}
            onCountChange={(delta) => onCommentsChange(data.id, delta)}
          />

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 transition-colors", data.isFavorite && "text-red-500 hover:text-red-600")}
            onClick={handleFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={cn("w-4 h-4", data.isFavorite && "fill-current")} />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="p-8 text-center border-dashed">
      <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
      <h3 className="text-lg font-semibold mb-2">Nenhuma recomendação ainda</h3>
      <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
        Seja o primeiro a compartilhar uma descoberta musical com a comunidade!
      </p>
      <Button asChild>
        <Link href="/nova-recomendacao">
          <Plus className="w-4 h-4 mr-2" />
          Criar Recomendação
        </Link>
      </Button>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-0 pt-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 px-4">
            <div className="flex gap-4 mb-4">
              <div className="w-28 h-28 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-8 w-full bg-muted rounded mt-2" />
              </div>
            </div>
            <div className="h-4 w-full bg-muted rounded mb-2" />
            <div className="h-4 w-2/3 bg-muted rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// --- Main Page ---

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [viewMode, setViewMode] = useState('list')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all')

  const loadRecommendations = async () => {
    try {
      setIsLoading(true)
      // Adicionado filtro de período
      const response = await getRecommendations(20, 0, undefined, 'recent', period)

      if (response.success && response.data) {
        let data = response.data

        // Checar favoritos se estiver logado
        if (isAuthenticated && data.length > 0) {
          const songIds = data.map((r) => r.music.id)
          const favResponse = await checkFavorites(songIds)
          if (favResponse.success && favResponse.data) {
            const savedSet = new Set(favResponse.data.savedIds)
            data = data.map((rec) => ({
              ...rec,
              isFavorite: savedSet.has(rec.music.id),
            }))
          }
        }
        setRecommendations(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [isAuthenticated, period]) // Recarrega quando autenticação ou período mudam

  const handleVote = async (id: number, voteType: 'up' | 'down') => {
    // 1. Otimistic Update
    setRecommendations(prev => prev.map(rec => {
      if (rec.id !== id) return rec

      const currentVote = rec.userVote
      let newVote: 'up' | 'down' | null = voteType
      let upvoteDelta = 0
      let downvoteDelta = 0

      if (currentVote === voteType) {
        newVote = null
        if (voteType === 'up') upvoteDelta = -1
        else downvoteDelta = -1
      } else {
        if (currentVote === 'up') upvoteDelta = -1
        else if (currentVote === 'down') downvoteDelta = -1

        if (voteType === 'up') upvoteDelta += 1
        else downvoteDelta += 1
      }

      return {
        ...rec,
        userVote: newVote,
        stats: {
          ...rec.stats,
          upvotes: rec.stats.upvotes + upvoteDelta,
          downvotes: rec.stats.downvotes + downvoteDelta
        }
      }
    }))

    // 2. API Call
    try {
      if (!isAuthenticated) return // Opcional: mostrar toast de login
      await voteRecommendation(id, voteType === 'up' ? 'upvote' : 'downvote')
    } catch (err) {
      console.error('Failed to vote:', err)
      // Opcional: Reverter estado em caso de erro
    }
  }

  const handleCommentsChange = (id: number, delta: number) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id !== id) return rec
      return {
        ...rec,
        stats: {
          ...rec.stats,
          comments: rec.stats.comments + delta
        }
      }
    }))
  }

  const handleFavoriteToggle = async (recId: number, songId: number) => {
    if (!isAuthenticated) return

    const response = await toggleFavorite(songId)
    if (response.success && response.data) {
      setRecommendations((prev) =>
        prev.map((rec) => {
          if (rec.id !== recId) return rec
          return { ...rec, isFavorite: response.data!.isFavorite }
        })
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <section className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Feed de Recomendações
          </h1>
          <p className="text-muted-foreground">
            Descubra novas músicas recomendadas pela comunidade
          </p>
        </section>

        <section className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">Período</span>
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as 'today' | 'week' | 'month' | 'all')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="all">Todos os Tempos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
            <ToggleGroupItem value="list" aria-label="Lista">
              <LayoutList className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grade">
              <LayoutGrid className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </section>

        <section className={cn(
          "space-y-6",
          viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0"
        )}>
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
              <p className="text-destructive mb-4 font-medium">{error}</p>
              <Button onClick={() => loadRecommendations()} variant="outline">
                Tentar novamente
              </Button>
            </Card>
          ) : recommendations.length === 0 ? (
            <EmptyState />
          ) : (
            recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                data={rec}
                onVote={handleVote}
                onCommentsChange={handleCommentsChange}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))
          )}
        </section>
      </main>
    </div>
  )
}