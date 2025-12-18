'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Flame,
  Music,
  Menu,
  Search,
  Bell,
  Settings,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Play,
  Loader2,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SidebarContent } from '@/components/sidebar'
import { getRecommendations, voteRecommendation, type Recommendation } from '@/lib/api/recommendations'

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR')
}

function PositionBadge({ position }: { position: number }) {
  if (position === 1) return <span className="text-xl">🥇</span>
  if (position === 2) return <span className="text-xl">🥈</span>
  if (position === 3) return <span className="text-xl">🥉</span>
  return <span className="text-sm font-bold text-muted-foreground w-6 text-center">{position}</span>
}

function TrendingCard({ 
  rec, 
  position,
  onVote 
}: { 
  rec: Recommendation
  position: number
  onVote: (id: number, type: 'up' | 'down') => void 
}) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <PositionBadge position={position} />
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0">
            {rec.music.coverUrl ? (
              <img src={rec.music.coverUrl} alt={rec.music.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Music className="w-7 h-7 text-primary/60" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{rec.music.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{rec.music.artist}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{rec.music.genre || 'Musica'}</Badge>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(rec.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">{rec.stats.upvotes}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{rec.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={rec.user.avatar ?? undefined} />
            <AvatarFallback className="text-[10px]">{getInitials(rec.user.name)}</AvatarFallback>
          </Avatar>
          <Link href={`/perfil/${rec.user.id}`} className="text-xs text-muted-foreground hover:underline">
            {rec.user.name}
          </Link>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-2">
        <div className="flex items-center gap-2 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn('gap-1.5 h-8', rec.userVote === 'up' && 'text-emerald-500')}
            onClick={() => onVote(rec.id, 'up')}
          >
            <ThumbsUp className="w-3.5 h-3.5" />{rec.stats.upvotes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn('gap-1.5 h-8', rec.userVote === 'down' && 'text-red-500')}
            onClick={() => onVote(rec.id, 'down')}
          >
            <ThumbsDown className="w-3.5 h-3.5" />{rec.stats.downvotes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 h-8">
            <MessageCircle className="w-3.5 h-3.5" />{rec.stats.comments}
          </Button>
          <div className="flex-1" />
          {rec.music.link && (
            <Button variant="ghost" size="sm" className="h-8" asChild>
              <a href={rec.music.link} target="_blank" rel="noopener noreferrer">
                <Play className="w-3.5 h-3.5 mr-1" />Ouvir
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <Flame className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">Nenhuma recomendacao em alta</h3>
      <p className="text-muted-foreground mb-4">
        Seja o primeiro a recomendar uma musica!
      </p>
      <Button asChild>
        <Link href="/nova-recomendacao">Criar Recomendacao</Link>
      </Button>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-muted rounded" />
              <div className="w-14 h-14 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

const GENRES = [
  { value: 'all', label: 'Todos' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Rock', label: 'Rock' },
  { value: 'Hip Hop', label: 'Hip Hop' },
  { value: 'R&B', label: 'R&B' },
  { value: 'Eletronica', label: 'Eletronica' },
  { value: 'Jazz', label: 'Jazz' },
  { value: 'MPB', label: 'MPB' },
  { value: 'Sertanejo', label: 'Sertanejo' },
  { value: 'Funk', label: 'Funk' },
  { value: 'Indie', label: 'Indie' },
]

export default function TrendingPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week')
  const [genre, setGenre] = useState('all')

  useEffect(() => {
    async function loadTrending() {
      setIsLoading(true)
      try {
        const response = await getRecommendations(20, 0, undefined, 'trending', period, genre)
        if (response.success) {
          setRecommendations(response.data)
        }
      } catch (err) {
        console.error('Failed to load trending:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadTrending()
  }, [period, genre])

  const handleVote = async (id: number, voteType: 'up' | 'down') => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id !== id) return rec
      const currentVote = rec.userVote
      let newVote: 'up' | 'down' | null = voteType
      let upvoteDelta = 0, downvoteDelta = 0
      if (currentVote === voteType) {
        newVote = null
        if (voteType === 'up') upvoteDelta = -1; else downvoteDelta = -1
      } else {
        if (currentVote === 'up') upvoteDelta = -1
        else if (currentVote === 'down') downvoteDelta = -1
        if (voteType === 'up') upvoteDelta += 1; else downvoteDelta += 1
      }
      return { ...rec, userVote: newVote, stats: { ...rec.stats, upvotes: rec.stats.upvotes + upvoteDelta, downvotes: rec.stats.downvotes + downvoteDelta } }
    }))
    try { await voteRecommendation(id, voteType === 'up' ? 'upvote' : 'downvote') } catch (err) { console.error('Vote failed:', err) }
  }

  return (
    <div className="min-h-screen bg-background">
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Em Alta</h1>
            </div>
            <p className="text-muted-foreground">Recomendacoes mais votadas da comunidade</p>
          </section>

          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Periodo</span>
              <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Genero</span>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map(g => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <section>
            {isLoading ? (
              <LoadingSkeleton />
            ) : recommendations.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <TrendingCard 
                    key={rec.id} 
                    rec={rec} 
                    position={index + 1}
                    onVote={handleVote} 
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
  )
}