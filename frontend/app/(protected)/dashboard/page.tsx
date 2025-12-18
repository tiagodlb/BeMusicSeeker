'use client'

import { SetStateAction, useState } from 'react'
import Link from 'next/link'
import { 
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
  Menu,
  Search,
  Bell,
  Settings,
  Heart,
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Sidebar, SidebarContent } from '@/components/sidebar'

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
            <Heart className="w-4 h-4" />
          </Button>

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
      <Sidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center justify-around gap-6 px-4 sm:px-6 lg:px-8">
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

        <main className="p-4 sm:p-6 lg:p-8">
          <section className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Bem-vindo de volta, <span className="text-primary">Tiago</span>
            </h1>
            <p className="text-muted-foreground">
              Você tem <span className="text-primary font-medium">3 notificações</span> não lidas
            </p>
          </section>

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