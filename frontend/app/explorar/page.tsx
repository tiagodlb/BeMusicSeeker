'use client'

import { SetStateAction, useState } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Zap, 
  BarChart3, 
  Compass, 
  Heart, 
  Users, 
  Plus, 
  ChevronDown,
  Menu,
  Search,
  Bell,
  Settings,
  LayoutList,
  LayoutGrid,
  Music,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
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
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Recommendation {
  id: string
  user: {
    name: string
    initials: string
    avatar?: string
    profileUrl: string
  }
  timestamp: string
  music: {
    title: string
    artist: string
    genre: string
    coverUrl?: string
    duration: string
  }
  description: string
  tags: string[]
  stats: {
    upvotes: number
    downvotes: number
    comments: number
  }
  userVote?: 'up' | 'down' | null
}

interface Comment {
  id: string
  user: {
    name: string
    initials: string
    avatar?: string
  }
  content: string
  timestamp: string
  likes: number
  userLiked?: boolean
}

const genres = [
  'Rock',
  'Pop',
  'Hip-Hop',
  'Eletrônica',
  'Jazz',
  'MPB',
  'Indie',
  'Blues',
  'Clássico',
  'Samba',
  'Forró',
  'Reggae',
]

const moods = [
  { name: 'Energético', icon: '⚡', color: 'bg-amber-100/40 hover:bg-amber-100/60 border-amber-200' },
  { name: 'Relaxante', icon: '🧘', color: 'bg-blue-100/40 hover:bg-blue-100/60 border-blue-200' },
  { name: 'Melancólico', icon: '🌧️', color: 'bg-slate-100/40 hover:bg-slate-100/60 border-slate-200' },
  { name: 'Motivacional', icon: '💪', color: 'bg-green-100/40 hover:bg-green-100/60 border-green-200' },
  { name: 'Nostálgico', icon: '📼', color: 'bg-purple-100/40 hover:bg-purple-100/60 border-purple-200' },
  { name: 'Festeiro', icon: '🎉', color: 'bg-rose-100/40 hover:bg-rose-100/60 border-rose-200' },
]

const genreStats = {
  'Rock': { count: 342, trending: true },
  'Pop': { count: 456, trending: true },
  'Hip-Hop': { count: 289, trending: false },
  'Eletrônica': { count: 234, trending: true },
  'Jazz': { count: 145, trending: false },
  'MPB': { count: 178, trending: false },
  'Indie': { count: 267, trending: false },
  'Blues': { count: 89, trending: false },
  'Clássico': { count: 76, trending: false },
  'Samba': { count: 92, trending: false },
  'Forró': { count: 58, trending: false },
  'Reggae': { count: 103, trending: false },
}

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home, badge: null },
  { href: '/trending', label: 'Em Alta', icon: Zap, badge: null },
  { href: '/explorar', label: 'Explorar', icon: Compass, badge: null },
  { href: '/rankings', label: 'Rankings', icon: BarChart3, badge: null },
  { href: '/favoritos', label: 'Favoritos', icon: Heart, badge: null },
]

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    user: {
      name: 'Maria Lima',
      initials: 'ML',
      profileUrl: '/perfil/maria-lima'
    },
    timestamp: '2 horas atrás',
    music: {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      genre: 'Rock',
      duration: '5:55'
    },
    description: 'Uma das melhores músicas de rock de todos os tempos. Compositivamente perfeita, com mudanças de tom que surpreendem a cada segundo.',
    tags: ['clássico', 'epic', 'rock-clássico'],
    stats: { upvotes: 342, downvotes: 2, comments: 28 },
    userVote: 'up'
  },
  {
    id: '2',
    user: {
      name: 'João Santos',
      initials: 'JS',
      profileUrl: '/perfil/joao-santos'
    },
    timestamp: '4 horas atrás',
    music: {
      title: 'Levitating',
      artist: 'Dua Lipa',
      genre: 'Pop',
      duration: '3:23'
    },
    description: 'Super animada para festa! A produção é impecável e a vibe positiva da música é contagiante. Definitivamente um hino pop moderno.',
    tags: ['festa', 'feel-good', 'dança'],
    stats: { upvotes: 156, downvotes: 5, comments: 12 },
    userVote: null
  },
  {
    id: '3',
    user: {
      name: 'Pedro Costa',
      initials: 'PC',
      profileUrl: '/perfil/pedro-costa'
    },
    timestamp: '6 horas atrás',
    music: {
      title: 'Sicko Mode',
      artist: 'Travis Scott',
      genre: 'Hip-Hop',
      duration: '5:12'
    },
    description: 'Beat insano, produção impecável. Travis Scott conseguiu criar uma obra-prima com colaborações perfeitas. Um clássico do hip-hop moderno.',
    tags: ['viral', 'energético', 'hip-hop'],
    stats: { upvotes: 201, downvotes: 8, comments: 19 },
    userVote: null
  },
]

function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
          <Music className="w-6 h-6" />
        </div>
        <span className="font-bold text-lg hidden sm:inline">BeMusicShare</span>
      </Link>

      <Separator />

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-sm',
              item.href === '/explorar'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      <Separator />

      {/* Create Recommendation Button */}
      <Button className="w-full gap-2" asChild>
        <Link href="/nova-recomendacao">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Recomendação</span>
        </Link>
      </Button>
    </div>
  )
}

function RecommendationCard({
  rec,
  onVote,
}: {
  rec: Recommendation
  onVote?: (id: string, vote: 'up' | 'down' | null) => void
}) {
  const [showComments, setShowComments] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState([0])
  const [volume, setVolume] = useState([70])
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'Ana Silva', initials: 'AS', avatar: undefined },
      content: 'Essa música é incrível! Perfeita para aqueles dias melancólicos.',
      timestamp: '2 horas atrás',
      likes: 12,
      userLiked: false,
    },
    {
      id: '2',
      user: { name: 'Carlos Mendes', initials: 'CM', avatar: undefined },
      content: 'Concordo totalmente! A produção é muito boa.',
      timestamp: '1 hora atrás',
      likes: 5,
      userLiked: false,
    },
  ])
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: String(comments.length + 1),
        user: {
          name: 'Você',
          initials: 'VC',
        },
        content: newComment,
        timestamp: 'agora',
        likes: 0,
        userLiked: false,
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: c.userLiked ? c.likes - 1 : c.likes + 1,
              userLiked: !c.userLiked,
            }
          : c
      )
    )
  }
  
  const isPopular = rec.stats.upvotes > 200
  const isTrending = rec.stats.comments > 20
  
  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      {/* Badges */}
      {(isPopular || isTrending) && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {isPopular && (
            <Badge className="bg-red-500/90 hover:bg-red-600 animate-pulse">
              🔥 Popular
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-orange-500/90 hover:bg-orange-600">
              📈 Trending
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={rec.user.avatar} />
            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-blue-600 text-white">
              {rec.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link 
              href={rec.user.profileUrl} 
              className="text-sm font-medium hover:underline"
            >
              {rec.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{rec.timestamp}</p>
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

      <CardContent className="pt-4 space-y-4">
        {/* Music Info with Cover */}
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-lg bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
            {rec.music.coverUrl ? (
              <img 
                src={rec.music.coverUrl} 
                alt={rec.music.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{rec.music.title}</h3>
            <p className="text-sm text-muted-foreground mb-1">{rec.music.artist}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {rec.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        {rec.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {rec.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Player */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Button 
            size="icon" 
            className="h-9 w-9 rounded-full flex-shrink-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </Button>
          
          <div className="flex-1 space-y-1 min-w-0">
            <Slider 
              value={progress} 
              onValueChange={setProgress}
              max={100} 
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>{rec.music.duration}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Slider 
              value={volume} 
              onValueChange={setVolume}
              max={100} 
              step={1}
              className="w-16 cursor-pointer"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() =>
              onVote?.(
                rec.id,
                rec.userVote === 'up' ? null : 'up'
              )
            }
            className={cn(
              'flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-accent',
              rec.userVote === 'up'
                ? 'text-green-500'
                : 'text-muted-foreground hover:text-green-500'
            )}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{rec.stats.upvotes}</span>
          </button>
          
          <button
            onClick={() =>
              onVote?.(
                rec.id,
                rec.userVote === 'down' ? null : 'down'
              )
            }
            className={cn(
              'flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-accent',
              rec.userVote === 'down'
                ? 'text-red-500'
                : 'text-muted-foreground hover:text-red-500'
            )}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{rec.stats.downvotes}</span>
          </button>

          <Dialog open={showComments} onOpenChange={setShowComments}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent">
                <MessageCircle className="w-4 h-4" />
                <span>{rec.stats.comments}</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
              <div className="flex flex-col h-full bg-gradient-to-b from-background via-background to-background/95">
                {/* Header with Music Info - Enhanced */}
                <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-b border-primary/20 px-8 py-6 space-y-4 flex-shrink-0">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {rec.music.title}
                    </h2>
                    <p className="text-base text-muted-foreground">{rec.music.artist}</p>
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-sm bg-primary/10 rounded-full px-3 py-1.5">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{comments.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-red-500/10 rounded-full px-3 py-1.5">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="font-semibold">{rec.stats.upvotes}</span>
                    </div>
                  </div>
                </div>

                {/* Comments List - Enhanced */}
                <div className="flex-1 overflow-y-auto space-y-3 px-8 py-6">
                  {comments.length > 0 ? (
                    comments.map((comment, idx) => (
                      <div
                        key={comment.id}
                        className="group rounded-xl border border-transparent hover:border-primary/30 bg-gradient-to-r from-accent/20 to-accent/10 p-4 transition-all hover:bg-gradient-to-r hover:from-accent/40 hover:to-accent/20 hover:shadow-md"
                        style={{
                          animation: `slideIn 0.3s ease-out ${idx * 0.05}s backwards`,
                        }}
                      >
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/20">
                            <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                              {comment.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold">{comment.user.name}</p>
                                <p className="text-xs text-muted-foreground/70">
                                  {comment.timestamp}
                                </p>
                              </div>
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground/50" />
                              </button>
                            </div>
                            <p className="text-sm text-foreground/90 mt-3 break-words leading-relaxed font-medium">
                              {comment.content}
                            </p>
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={cn(
                                'flex items-center gap-2 mt-3 text-xs font-bold transition-all hover:scale-110',
                                comment.userLiked
                                  ? 'text-red-500'
                                  : 'text-muted-foreground hover:text-red-500'
                              )}
                            >
                              <Heart
                                className="w-4 h-4 transition-transform"
                                fill={comment.userLiked ? 'currentColor' : 'none'}
                              />
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <div className="bg-primary/10 rounded-full p-4 mb-3">
                        <MessageCircle className="w-8 h-8 text-primary/50" />
                      </div>
                      <p className="text-base font-semibold text-muted-foreground">Nenhum comentário</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Seja o primeiro a compartilhar sua opinião!</p>
                    </div>
                  )}
                </div>

                {/* Input Comment - Enhanced */}
                <div className="border-t border-primary/20 bg-gradient-to-t from-background to-background/50 px-8 py-6 space-y-3 flex-shrink-0">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/30">
                      <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                        VS
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Compartilhe sua opinião sobre essa música..."
                        className="w-full px-4 py-3 text-sm border border-primary/20 rounded-xl resize-none bg-accent/40 focus:bg-accent/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-muted-foreground/50"
                        rows={3}
                      />
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewComment('')}
                          disabled={!newComment.trim()}
                          className="rounded-lg"
                        >
                          Limpar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="rounded-lg gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex-1" />

          <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent">
            <Heart className="w-4 h-4" />
            <span>Salvar</span>
          </button>

          <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-accent">
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function ExplorarPage() {
  const [layout, setLayout] = useState<'list' | 'grid'>('list')
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'trending' | 'popular'>('recent')
  const [recommendations, setRecommendations] = useState(mockRecommendations)

  const handleVote = (id: string, vote: 'up' | 'down' | null) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? {
              ...rec,
              userVote: vote,
              stats: {
                ...rec.stats,
                upvotes:
                  rec.userVote === 'up' && vote === null
                    ? rec.stats.upvotes - 1
                    : rec.userVote !== 'up' && vote === 'up'
                      ? rec.stats.upvotes + 1
                      : rec.stats.upvotes,
              },
            }
          : rec
      )
    )
  }

  let filteredRecommendations = recommendations

  // Filtro por gênero
  if (selectedGenre !== 'Todos') {
    filteredRecommendations = filteredRecommendations.filter(
      (rec) => rec.music.genre === selectedGenre
    )
  }

  // Ordenação
  if (sortBy === 'trending') {
    filteredRecommendations = [...filteredRecommendations].sort(
      (a, b) => b.stats.upvotes - a.stats.upvotes
    )
  } else if (sortBy === 'popular') {
    filteredRecommendations = [...filteredRecommendations].sort(
      (a, b) => b.stats.comments - a.stats.comments
    )
  } else if (sortBy === 'mostUpvoted') {
    filteredRecommendations = [...filteredRecommendations].sort(
      (a, b) => b.stats.upvotes - a.stats.upvotes
    )
  } else if (sortBy === 'oldest') {
    filteredRecommendations = [...filteredRecommendations].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="font-bold">Explorar</h1>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[256px_1fr] gap-6 p-4 lg:p-6">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Hero Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl font-bold mb-2">Explorar Gêneros</h1>
                <p className="text-muted-foreground">
                  Descubra recomendações incríveis de música em seus gêneros favoritos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ToggleGroup
                  type="single"
                  value={layout}
                  onValueChange={(v) => v && setLayout(v as 'list' | 'grid')}
                  className="border rounded-lg"
                >
                  <ToggleGroupItem value="list" aria-label="Lista">
                    <LayoutList className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grid">
                    <LayoutGrid className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          {/* Trending Moods Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Como está a sua vibe hoje?</h2>
              <p className="text-sm text-muted-foreground">Selecione um mood para explorar recomendações</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() =>
                    setSelectedMood(selectedMood === mood.name ? null : mood.name)
                  }
                  className={cn(
                    'group relative rounded-lg p-4 transition-all border',
                    'flex flex-col items-center gap-2',
                    selectedMood === mood.name
                      ? 'ring-2 ring-primary scale-105 bg-primary/5'
                      : '',
                    mood.color
                  )}
                >
                  <span className="text-2xl">{mood.icon}</span>
                  <span className="text-xs font-medium text-center">
                    {mood.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters Section */}
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Music className="w-4 h-4" />
                Filtrar por Gênero
              </label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="border-primary/20 focus:ring-primary/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">
                    <span>🎵 Todos os Gêneros</span>
                  </SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="border-primary/20 focus:ring-primary/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">📅 Mais Recentes</SelectItem>
                  <SelectItem value="trending">🔥 Em Alta</SelectItem>
                  <SelectItem value="popular">💬 Mais Comentadas</SelectItem>
                  <SelectItem value="mostUpvoted">❤️ Mais Curtidas</SelectItem>
                  <SelectItem value="oldest">⏳ Mais Antigas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          {selectedGenre !== 'Todos' && (
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {genreStats[selectedGenre as keyof typeof genreStats]?.count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recomendações de {selectedGenre}
                    </p>
                  </div>
                  {genreStats[selectedGenre as keyof typeof genreStats]?.trending && (
                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-semibold text-sm">Tendência</p>
                        <p className="text-xs text-muted-foreground">Em alta</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {selectedMood && `${selectedMood} • `}
                {selectedGenre === 'Todos'
                  ? 'Todas as Recomendações'
                  : `${selectedGenre}`}
              </h2>
              {filteredRecommendations.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {filteredRecommendations.length} resultado
                  {filteredRecommendations.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            {filteredRecommendations.length > 0 ? (
              <div className={layout === 'grid' ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
                {filteredRecommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    onVote={handleVote}
                  />
                ))}
              </div>
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <Music className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="font-medium mb-1">
                    Nenhuma recomendação encontrada
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Seja o primeiro a recomendar uma música deste gênero!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
