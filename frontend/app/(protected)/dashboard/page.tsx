'use client'

import { SetStateAction, useState, useEffect } from 'react'
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
  Menu,
  Search,
  Bell,
  Settings,
  Heart,
  Loader2,
  Plus,
  ExternalLink,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SidebarContent } from '@/components/sidebar'
import { getRecommendations } from '@/lib/api/recommendations'
import { checkFavorites, toggleFavorite } from '@/lib/api/favourites'
import { CommentsDrawer } from '@/components/comments-drawer'
import { useAuth } from '@/lib/auth-context'

interface Recommendation {
  id: number
  user: {
    id: number
    name: string
    avatar: string | null
  }
  music: {
    id: number
    title: string
    artist: string
    genre: string
    coverUrl: string | null
    link: string
  }
  description: string
  tags: string[]
  stats: {
    upvotes: number
    downvotes: number
    comments: number
  }
  createdAt: string
  userVote?: 'up' | 'down' | null
  isFavorite?: boolean
}

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
    return (
      <div className="text-sm text-muted-foreground italic">
        Sem link de audio
      </div>
    )
  }

  if (playerType === 'soundcloud') {
    return (
      <div className="space-y-2">
        {showEmbed ? (
          <iframe
            width="100%"
            height="120"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={getSoundCloudEmbedUrl(url)}
            className="rounded-lg"
          />
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowEmbed(true)}
          >
            <Play className="w-4 h-4" />
            Reproduzir no SoundCloud
          </Button>
        )}
      </div>
    )
  }

  if (playerType === 'spotify') {
    const embedUrl = getSpotifyEmbedUrl(url)
    if (embedUrl) {
      return (
        <div className="space-y-2">
          {showEmbed ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
            />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowEmbed(true)}
            >
              <Play className="w-4 h-4" />
              Reproduzir no Spotify
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
        <div className="space-y-2">
          {showEmbed ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="120"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowEmbed(true)}
            >
              <Play className="w-4 h-4" />
              Reproduzir no YouTube
            </Button>
          )}
        </div>
      )
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-4 h-4" />
        Ouvir
      </a>
    </Button>
  )
}

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
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={data.user.avatar ?? undefined} />
            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-blue-600 text-white">
              {getInitials(data.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link 
              href={`/perfil/${data.user.id}`} 
              className="text-sm font-medium hover:underline"
            >
              {data.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{formatTimeAgo(data.createdAt)}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Salvar</DropdownMenuItem>
              <DropdownMenuItem>Copiar link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Denunciar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex gap-4 mb-4">
          <div className="w-28 h-28 rounded-lg bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0">
            {data.music.coverUrl ? (
              <img 
                src={data.music.coverUrl} 
                alt={data.music.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-10 h-10 text-primary/60" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-semibold truncate">{data.music.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{data.music.artist}</p>
            </div>

            <MusicPlayer url={data.music.link} title={data.music.title} />
          </div>
        </div>

        <p className="text-sm mb-3">{data.description}</p>

        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {data.music.genre && (
            <Badge variant="outline" className="text-xs">
              {data.music.genre}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex items-center gap-1 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn('gap-1.5', data.userVote === 'up' && 'text-emerald-500')}
            onClick={() => onVote(data.id, 'up')}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="tabular-nums">{data.stats.upvotes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn('gap-1.5', data.userVote === 'down' && 'text-red-500')}
            onClick={() => onVote(data.id, 'down')}
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="tabular-nums">{data.stats.downvotes}</span>
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
            className={cn(
              "h-8 w-8 transition-colors",
              data.isFavorite && "text-red-500 hover:text-red-600"
            )}
            onClick={handleFavorite}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className={cn("w-4 h-4", data.isFavorite && "fill-current")} />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">Nenhuma recomendacao ainda</h3>
      <p className="text-muted-foreground mb-4">
        Seja o primeiro a compartilhar uma descoberta musical!
      </p>
      <Button asChild>
        <Link href="/nova-recomendacao">
          <Plus className="w-4 h-4 mr-2" />
          Criar Recomendacao
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
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex gap-4 mb-4">
              <div className="w-28 h-28 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-full bg-muted rounded" />
              </div>
            </div>
            <div className="h-16 bg-muted rounded mb-3" />
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

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [viewMode, setViewMode] = useState('list')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setIsLoading(true)
        const response = await getRecommendations(20, 0)
        if (response.success && response.data) {
          setRecommendations(response.data)

          // load favorite status if authenticated
          if (isAuthenticated && response.data.length > 0) {
            const songIds = response.data.map((r) => r.music.id)
            const favResponse = await checkFavorites(songIds)
            if (favResponse.success && favResponse.data) {
              const savedSet = new Set(favResponse.data.savedIds)
              setRecommendations((prev) =>
                prev.map((rec) => ({
                  ...rec,
                  isFavorite: savedSet.has(rec.music.id),
                }))
              )
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [isAuthenticated])

  const handleVote = (id: number, voteType: 'up' | 'down') => {
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

    // TODO: call API to persist vote
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
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar..." className="pl-9" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
          <section className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Feed de Recomendacoes
            </h1>
            <p className="text-muted-foreground">
              Descubra novas musicas recomendadas pela comunidade
            </p>
          </section>

          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Periodo</span>
              <Select defaultValue="week">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Ultima Semana</SelectItem>
                  <SelectItem value="month">Ultimo Mes</SelectItem>
                  <SelectItem value="all">Todos os Tempos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

            <ToggleGroup type="single" value={viewMode} onValueChange={(v: SetStateAction<string>) => v && setViewMode(v)}>
              <ToggleGroupItem value="list" aria-label="Lista">
                <LayoutList className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grade">
                <LayoutGrid className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          <section className="space-y-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <Card className="p-8 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
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
    </div>
  )
}