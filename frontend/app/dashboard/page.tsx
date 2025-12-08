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
      title: 'Neon Dreams',
      artist: 'Midnight Runners',
      duration: '4:02'
    },
    description: 'Uma das melhores descobertas do ano para mim. O synth retro combinado com vocais modernos cria uma atmosfera única. Perfeita para ouvir enquanto trabalha ou estuda.',
    tags: ['synthwave', 'retro', 'para-estudar'],
    stats: { upvotes: 342, downvotes: 12, comments: 28 },
    userVote: 'up'
  },
  {
    id: '2',
    user: {
      name: 'Rafael Costa',
      initials: 'RC',
      profileUrl: '/perfil/rafael-costa'
    },
    timestamp: '4 horas atrás',
    music: {
      title: 'Céu de Santo Amaro',
      artist: 'Flávio Venturini',
      duration: '5:18'
    },
    description: 'Clássico atemporal da MPB que sempre me emociona. A poesia das letras combinada com a melodia suave faz dessa música uma obra-prima brasileira que todos deveriam conhecer.',
    tags: ['mpb', 'clássico', 'brasileiro'],
    stats: { upvotes: 256, downvotes: 8, comments: 45 },
    userVote: null
  },
  {
    id: '3',
    user: {
      name: 'Julia Ferreira',
      initials: 'JF',
      profileUrl: '/perfil/julia-ferreira'
    },
    timestamp: 'Ontem',
    music: {
      title: 'Electric Feel',
      artist: 'MGMT',
      duration: '3:49'
    },
    description: 'Impossível ouvir essa música e não se sentir em uma festa de verão. O groove é contagiante e a produção é impecável. Um hit indie que merece ser redescoberto por uma nova geração.',
    tags: ['indie', 'electropop', 'verão', 'festa'],
    stats: { upvotes: 189, downvotes: 5, comments: 67 },
    userVote: null
  }
]

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home, active: true },
  { href: '/trending', label: 'Em Alta', icon: Zap },
  { href: '/rankings', label: 'Rankings', icon: BarChart3 },
  { href: '/explorar', label: 'Explorar Gêneros', icon: Compass },
]

const libraryItems = [
  { href: '/favoritos', label: 'Meus Favoritos', icon: Heart },
  { href: '/seguindo', label: 'Seguindo', icon: Users },
]

function SidebarContent() {
  return (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-purple-600 flex items-center justify-center">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">BeMusicShare</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Menu
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.active 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Biblioteca
          </p>
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4">
        <Button asChild className="w-full">
          <Link href="/nova-recomendacao">
            <Plus className="w-4 h-4 mr-2" />
            Criar Recomendação
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
              <Avatar className="w-9 h-9">
                <AvatarImage src="" />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm">
                  TS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Tiago Silva</p>
                <p className="text-xs text-muted-foreground">Curador</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

function RecommendationCard({ 
  data, 
  onVote 
}: { 
  data: Recommendation
  onVote: (id: string, type: 'up' | 'down') => void 
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState([0])
  const [volume, setVolume] = useState([75])

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={data.user.avatar} />
            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-blue-600 text-white">
              {data.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link 
              href={data.user.profileUrl} 
              className="text-sm font-medium hover:underline"
            >
              {data.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{data.timestamp}</p>
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
              <Music className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg">{data.music.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{data.music.artist}</p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {data.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Button 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </Button>
          
          <div className="flex-1 space-y-1">
            <Slider 
              value={progress} 
              onValueChange={setProgress}
              max={100} 
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>{data.music.duration}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
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
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2",
              data.userVote === 'up' && "text-green-500 hover:text-green-500"
            )}
            onClick={() => onVote(data.id, 'up')}
          >
            <ThumbsUp className="w-4 h-4" />
            {data.stats.upvotes}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2",
              data.userVote === 'down' && "text-red-500 hover:text-red-500"
            )}
            onClick={() => onVote(data.id, 'down')}
          >
            <ThumbsDown className="w-4 h-4" />
            {data.stats.downvotes}
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            {data.stats.comments}
          </Button>

          <div className="flex-1" />

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [viewMode, setViewMode] = useState('list')

  const handleVote = (id: string, voteType: 'up' | 'down') => {
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
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center justify-around gap-6 px-4 sm:px-6 lg:px-8">
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

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Buscar músicas, artistas, pessoas..."
                  className="pl-9 border-black/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
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

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <section className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Bem-vindo de volta, <span className="text-primary">Tiago</span>
            </h1>
            <p className="text-muted-foreground">
              Você tem <span className="text-primary font-medium">3 notificações</span> não lidas
            </p>
          </section>

          {/* Filters */}
          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Período</span>
              <Select defaultValue="week">
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

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Gênero</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                  <SelectItem value="electronic">Eletrônica</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="mpb">MPB</SelectItem>
                  <SelectItem value="indie">Indie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Ordenar</span>
              <Select defaultValue="votes">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="votes">Mais Votados</SelectItem>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="following">Meus Seguidos</SelectItem>
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

          {/* Feed */}
          <section className="space-y-6">
            {recommendations.map((rec) => (
              <RecommendationCard 
                key={rec.id} 
                data={rec} 
                onVote={handleVote}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}