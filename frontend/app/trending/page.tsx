'use client'

import { useState } from 'react'
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
  Music,
  MoreHorizontal,
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  ThumbsUp,
  MessageCircle,
  Clock
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface TrendingMusic {
  id: string
  position: number
  previousPosition: number | null
  title: string
  artist: string
  coverUrl?: string
  genre: string
  stats: {
    upvotes: number
    comments: number
    plays: number
  }
  recommendedBy: {
    name: string
    initials: string
    avatar?: string
  }
  addedAt: string
}

const mockTrendingMusic: TrendingMusic[] = [
  {
    id: '1',
    position: 1,
    previousPosition: 3,
    title: 'Neon Dreams',
    artist: 'Midnight Runners',
    genre: 'Synthwave',
    stats: { upvotes: 342, comments: 28, plays: 1247 },
    recommendedBy: { name: 'Mariana Lima', initials: 'ML' },
    addedAt: '2 horas atrás'
  },
  {
    id: '2',
    position: 2,
    previousPosition: 1,
    title: 'Céu de Santo Amaro',
    artist: 'Flávio Venturini',
    genre: 'MPB',
    stats: { upvotes: 256, comments: 45, plays: 892 },
    recommendedBy: { name: 'Rafael Costa', initials: 'RC' },
    addedAt: '4 horas atrás'
  },
  {
    id: '3',
    position: 3,
    previousPosition: 5,
    title: 'Electric Feel',
    artist: 'MGMT',
    genre: 'Indie',
    stats: { upvotes: 189, comments: 67, plays: 2341 },
    recommendedBy: { name: 'Julia Ferreira', initials: 'JF' },
    addedAt: 'Ontem'
  },
  {
    id: '4',
    position: 4,
    previousPosition: 4,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Pop',
    stats: { upvotes: 178, comments: 34, plays: 3456 },
    recommendedBy: { name: 'Carlos Silva', initials: 'CS' },
    addedAt: 'Ontem'
  },
  {
    id: '5',
    position: 5,
    previousPosition: null,
    title: 'Aquarela',
    artist: 'Toquinho',
    genre: 'MPB',
    stats: { upvotes: 156, comments: 23, plays: 567 },
    recommendedBy: { name: 'Ana Paula', initials: 'AP' },
    addedAt: '2 dias atrás'
  },
  {
    id: '6',
    position: 6,
    previousPosition: 2,
    title: 'Redbone',
    artist: 'Childish Gambino',
    genre: 'R&B',
    stats: { upvotes: 145, comments: 41, plays: 1893 },
    recommendedBy: { name: 'Pedro Henrique', initials: 'PH' },
    addedAt: '2 dias atrás'
  },
  {
    id: '7',
    position: 7,
    previousPosition: 9,
    title: 'Breathe',
    artist: 'Pink Floyd',
    genre: 'Rock',
    stats: { upvotes: 134, comments: 52, plays: 2145 },
    recommendedBy: { name: 'Beatriz Santos', initials: 'BS' },
    addedAt: '3 dias atrás'
  },
  {
    id: '8',
    position: 8,
    previousPosition: 6,
    title: 'Alright',
    artist: 'Kendrick Lamar',
    genre: 'Hip-Hop',
    stats: { upvotes: 128, comments: 38, plays: 1567 },
    recommendedBy: { name: 'Lucas Oliveira', initials: 'LO' },
    addedAt: '3 dias atrás'
  },
  {
    id: '9',
    position: 9,
    previousPosition: 12,
    title: 'Strobe',
    artist: 'deadmau5',
    genre: 'Eletrônica',
    stats: { upvotes: 119, comments: 29, plays: 987 },
    recommendedBy: { name: 'Fernanda Costa', initials: 'FC' },
    addedAt: '4 dias atrás'
  },
  {
    id: '10',
    position: 10,
    previousPosition: 8,
    title: 'Construção',
    artist: 'Chico Buarque',
    genre: 'MPB',
    stats: { upvotes: 112, comments: 67, plays: 743 },
    recommendedBy: { name: 'Roberto Almeida', initials: 'RA' },
    addedAt: '5 dias atrás'
  }
]

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/trending', label: 'Em Alta', icon: Zap, active: true },
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

function TrendIndicator({ current, previous }: { current: number; previous: number | null }) {
  if (previous === null) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
              NOVO
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Entrou no ranking hoje</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const diff = previous - current

  if (diff > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">+{diff}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subiu {diff} posição(ões)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (diff < 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-1 text-red-500">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">{diff}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Caiu {Math.abs(diff)} posição(ões)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center text-muted-foreground">
            <Minus className="w-4 h-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Mesma posição</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function TrendingRow({ music, _index }: { music: TrendingMusic; _index: number }) {
  return (
    <TableRow className="group hover:bg-muted/50 cursor-pointer">
      <TableCell className="w-16">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-2xl font-bold tabular-nums",
            music.position <= 3 ? "text-primary" : "text-muted-foreground"
          )}>
            {music.position}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="w-16">
        <TrendIndicator current={music.position} previous={music.previousPosition} />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-md bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 overflow-hidden group-hover:ring-2 ring-primary/50 transition-all">
            {music.coverUrl ? (
              <img 
                src={music.coverUrl} 
                alt={music.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Play className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{music.title}</p>
            <p className="text-sm text-muted-foreground truncate">{music.artist}</p>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Badge variant="outline">{music.genre}</Badge>
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src={music.recommendedBy.avatar} />
            <AvatarFallback className="text-xs bg-linear-to-br from-emerald-500 to-blue-600 text-white">
              {music.recommendedBy.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate max-w-[120px]">
            {music.recommendedBy.name}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{music.stats.upvotes}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{music.stats.comments}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{music.addedAt}</span>
        </div>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
            <DropdownMenuItem>Adicionar aos favoritos</DropdownMenuItem>
            <DropdownMenuItem>Compartilhar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Ver perfil do artista</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export default function TrendingPage() {
  const [period, setPeriod] = useState('today')
  const [genre, setGenre] = useState('all')

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

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Buscar músicas, artistas, pessoas..."
                  className="pl-9"
                />
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

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Em Alta</h1>
            </div>
            <p className="text-muted-foreground">
              As músicas mais votadas e comentadas pela comunidade agora
            </p>
          </section>

          {/* Filters */}
          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Período</span>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Gênero</span>
              <Select value={genre} onValueChange={setGenre}>
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
                  <SelectItem value="rb">R&B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">10</span> de{' '}
              <span className="font-medium text-foreground">247</span> resultados
            </p>
          </section>

          {/* Top 3 Highlight */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {mockTrendingMusic.slice(0, 3).map((music, _index) => (
              <Card key={music.id} className={cn(
                "relative overflow-hidden group cursor-pointer transition-all hover:ring-2 ring-primary/50",
                _index === 0 && "md:col-span-1"
              )}>
                <div className={cn(
                  "absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                  _index === 0 && "bg-yellow-500",
                  _index === 1 && "bg-gray-400",
                  _index === 2 && "bg-amber-700"
                )}>
                  {_index + 1}
                </div>
                <CardContent className="p-4 pt-14">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 overflow-hidden">
                      {music.coverUrl ? (
                        <img 
                          src={music.coverUrl} 
                          alt={music.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="w-8 h-8 text-muted-foreground" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{music.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{music.artist}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{music.stats.upvotes}</span>
                        </div>
                        <TrendIndicator current={music.position} previous={music.previousPosition} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Full List */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead className="w-16">Trend</TableHead>
                  <TableHead>Música</TableHead>
                  <TableHead className="hidden md:table-cell">Gênero</TableHead>
                  <TableHead className="hidden lg:table-cell">Recomendado por</TableHead>
                  <TableHead>Engajamento</TableHead>
                  <TableHead className="hidden xl:table-cell">Adicionado</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrendingMusic.map((music, _index) => (
                  <TrendingRow key={music.id} music={music} _index={_index} />
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Load More */}
          <div className="flex justify-center mt-6">
            <Button variant="outline">
              Carregar mais
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}