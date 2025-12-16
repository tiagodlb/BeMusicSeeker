'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Zap,
  BarChart3,
  Compass,
  Heart,
  Plus,
  Menu,
  Bell,
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
  Share2,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/trending', icon: Zap, label: 'Trending' },
  { href: '/rankings', icon: BarChart3, label: 'Rankings' },
  { href: '/explorar', icon: Compass, label: 'Explorar' },
  { href: '/seguindo', icon: Users, label: 'Seguindo', badge: null },
  { href: '/favoritos', icon: Heart, label: 'Favoritos' },
]

const allRecommendations: Recommendation[] = [
  {
    id: '1',
    user: {
      name: 'João Silva',
      initials: 'JS',
      avatar: undefined,
      profileUrl: '/profile/joao',
    },
    timestamp: '2 horas atrás',
    music: {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      genre: 'Pop',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      duration: '3:20',
    },
    description: 'Uma música que mudou meu dia! Perfeita para qualquer momento.',
    tags: ['Pop', 'Eletrônico', 'Energético'],
    stats: { upvotes: 234, downvotes: 12, comments: 45 },
    userVote: null,
  },
  {
    id: '2',
    user: {
      name: 'Maria Santos',
      initials: 'MS',
      avatar: undefined,
      profileUrl: '/profile/maria',
    },
    timestamp: '1 hora atrás',
    music: {
      title: 'Levitating',
      artist: 'Dua Lipa',
      genre: 'Pop',
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      duration: '3:23',
    },
    description: 'Essa musica é simplesmente perfeita para animar o dia!',
    tags: ['Pop', 'Dance', 'Felicidade'],
    stats: { upvotes: 456, downvotes: 8, comments: 67 },
    userVote: null,
  },
  {
    id: '3',
    user: {
      name: 'Pedro Costa',
      initials: 'PC',
      avatar: undefined,
      profileUrl: '/profile/pedro',
    },
    timestamp: '30 minutos atrás',
    music: {
      title: 'Starboy',
      artist: 'The Weeknd ft. Daft Punk',
      genre: 'Eletrônico',
      coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
      duration: '3:50',
    },
    description: 'Clássico absoluto, nunca sai de moda',
    tags: ['Eletrônico', 'Hip-Hop', 'Noturno'],
    stats: { upvotes: 789, downvotes: 15, comments: 102 },
    userVote: null,
  },
  {
    id: '4',
    user: {
      name: 'Ana Lima',
      initials: 'AL',
      avatar: undefined,
      profileUrl: '/profile/ana',
    },
    timestamp: 'agora',
    music: {
      title: 'As It Was',
      artist: 'Harry Styles',
      genre: 'Pop',
      coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
      duration: '2:50',
    },
    description: 'Uma reflexão linda através da música',
    tags: ['Pop', 'Indie', 'Melancólico'],
    stats: { upvotes: 345, downvotes: 7, comments: 54 },
    userVote: null,
  },
]

const followedUsers = [
  { id: '1', name: 'João Silva', initials: 'JS' },
  { id: '2', name: 'Maria Santos', initials: 'MS' },
  { id: '3', name: 'Pedro Costa', initials: 'PC' },
  { id: '4', name: 'Ana Lima', initials: 'AL' },
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
              item.href === '/seguindo'
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

  return (
    <Card className="overflow-hidden">
      {/* Header with user info and timestamp */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <Link href={rec.user.profileUrl} className="flex items-center gap-3 hover:opacity-80">
            <Avatar>
              <AvatarImage src={rec.user.avatar} alt={rec.user.name} />
              <AvatarFallback>{rec.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-sm">{rec.user.name}</div>
              <div className="text-xs text-muted-foreground">{rec.timestamp}</div>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Não recomendo mais</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Denunciar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Music cover image */}
      <div className="relative bg-muted h-48 overflow-hidden group">
        <img
          src={rec.music.coverUrl}
          alt={rec.music.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold truncate">{rec.music.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{rec.music.artist}</p>
          </div>
          <p className="text-sm text-foreground line-clamp-2">{rec.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-2">
            {rec.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* Music player */}
      <CardContent className="space-y-4">
        {/* Play controls and progress */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Slider value={progress} onValueChange={setProgress} min={0} max={100} step={1} />
            <span className="text-xs text-muted-foreground w-8 text-right">{rec.music.duration}</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 px-1">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={1} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around text-xs text-muted-foreground pt-2 border-t">
          <div className="text-center">
            <div className="font-semibold text-foreground">{rec.stats.upvotes}</div>
            <div>Gostei</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{rec.stats.downvotes}</div>
            <div>Não gostei</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{rec.stats.comments}</div>
            <div>Comentários</div>
          </div>
        </div>
      </CardContent>

      {/* Action buttons */}
      <CardFooter className="gap-2 pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => onVote?.(rec.id, rec.userVote === 'up' ? null : 'up')}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Gostei
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-xs"
          onClick={() => onVote?.(rec.id, rec.userVote === 'down' ? null : 'down')}
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          Não gostei
        </Button>
        <Dialog open={showComments} onOpenChange={setShowComments}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
              <MessageCircle className="w-4 h-4 mr-1" />
              Comentar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="py-4">
              <h3 className="font-semibold mb-2">{rec.music.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{rec.music.artist}</p>

              {/* Comments section */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 pb-3 border-b last:border-b-0 animate-slideIn">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-muted-foreground mt-1"
                        onClick={() => {
                          // Handle like
                        }}
                      >
                        👍 {comment.likes}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div className="flex gap-2 border-t pt-4">
                <input
                  type="text"
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border border-input"
                />
                <Button size="sm" onClick={handleAddComment}>
                  Enviar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
          <Heart className="w-4 h-4 mr-1" />
          Salvar
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
          <Share2 className="w-4 h-4 mr-1" />
          Compartilhar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function SeguindoPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(allRecommendations)
  const [period, setPeriod] = useState('week')
  const [layout, setLayout] = useState<'compact' | 'detailed'>('detailed')

  const handleVote = (id: string, vote: 'up' | 'down' | null) => {
    setRecommendations(
      recommendations.map((rec) => (rec.id === id ? { ...rec, userVote: vote } : rec))
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop only */}
      <aside className="hidden md:flex w-64 border-r bg-card flex-col p-4 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile menu */}
        <div className="md:hidden sticky top-0 z-40 border-b bg-card p-4 flex items-center justify-between">
          <h1 className="font-bold">BeMusicShare</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Header with filters */}
        <div className="sticky top-0 md:top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Seguindo Agora</h1>
                <p className="text-sm text-muted-foreground">
                  Recomendações dos usuários que você segue
                </p>
              </div>
              <div className="hidden md:flex gap-2">
                <ToggleGroup type="single" value={layout} onValueChange={(v) => v && setLayout(v as any)}>
                  <ToggleGroupItem value="detailed">
                    <LayoutGrid className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="compact">
                    <LayoutList className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Filter section */}
            <div className="flex gap-4 flex-wrap">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="alltime">Todos os Tempos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Followed Users Section */}
        <div className="border-b bg-muted/30">
          <div className="p-6">
            <h2 className="font-semibold mb-4">Seus Seguidos</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {followedUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-center line-clamp-2 w-16">{user.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations list */}
        <div className="p-6">
          <div className={cn(
            layout === 'detailed'
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
          )}>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                onVote={handleVote}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
