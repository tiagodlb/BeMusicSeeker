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
  ThumbsUp,
  Headphones,
  Trophy,
  Medal,
  Crown,
  LayoutList,
  LayoutGrid,
  UserCircle,
  Mic2
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface RankedMusic {
  id: string
  position: number
  title: string
  artist: string
  coverUrl?: string
  genre: string
  stats: {
    upvotes: number
    comments: number
    plays: number
  }
}

interface RankedArtist {
  id: string
  position: number
  name: string
  avatar?: string
  initials: string
  genre: string
  stats: {
    followers: number
    tracks: number
    totalVotes: number
  }
}

interface RankedCurator {
  id: string
  position: number
  name: string
  avatar?: string
  initials: string
  stats: {
    recommendations: number
    totalVotes: number
    followers: number
  }
}

const mockMusics: RankedMusic[] = [
  { id: '1', position: 1, title: 'Neon Dreams', artist: 'Midnight Runners', genre: 'Synthwave', stats: { upvotes: 1247, comments: 89, plays: 4521 } },
  { id: '2', position: 2, title: 'Céu de Santo Amaro', artist: 'Flávio Venturini', genre: 'MPB', stats: { upvotes: 1189, comments: 124, plays: 3892 } },
  { id: '3', position: 3, title: 'Electric Feel', artist: 'MGMT', genre: 'Indie', stats: { upvotes: 1056, comments: 98, plays: 5234 } },
  { id: '4', position: 4, title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', stats: { upvotes: 987, comments: 76, plays: 8923 } },
  { id: '5', position: 5, title: 'Aquarela', artist: 'Toquinho', genre: 'MPB', stats: { upvotes: 923, comments: 112, plays: 2341 } },
  { id: '6', position: 6, title: 'Redbone', artist: 'Childish Gambino', genre: 'R&B', stats: { upvotes: 891, comments: 67, plays: 4123 } },
  { id: '7', position: 7, title: 'Breathe', artist: 'Pink Floyd', genre: 'Rock', stats: { upvotes: 856, comments: 145, plays: 3456 } },
  { id: '8', position: 8, title: 'Alright', artist: 'Kendrick Lamar', genre: 'Hip-Hop', stats: { upvotes: 834, comments: 89, plays: 5678 } },
  { id: '9', position: 9, title: 'Strobe', artist: 'deadmau5', genre: 'Eletrônica', stats: { upvotes: 798, comments: 54, plays: 2987 } },
  { id: '10', position: 10, title: 'Construção', artist: 'Chico Buarque', genre: 'MPB', stats: { upvotes: 765, comments: 167, plays: 1876 } },
]

const mockArtists: RankedArtist[] = [
  { id: '1', position: 1, name: 'Midnight Runners', initials: 'MR', genre: 'Synthwave', stats: { followers: 12453, tracks: 24, totalVotes: 8934 } },
  { id: '2', position: 2, name: 'Luna Park', initials: 'LP', genre: 'Indie', stats: { followers: 9876, tracks: 18, totalVotes: 7234 } },
  { id: '3', position: 3, name: 'Neon Pulse', initials: 'NP', genre: 'Eletrônica', stats: { followers: 8234, tracks: 32, totalVotes: 6123 } },
  { id: '4', position: 4, name: 'Acoustic Dreams', initials: 'AD', genre: 'MPB', stats: { followers: 7654, tracks: 15, totalVotes: 5678 } },
  { id: '5', position: 5, name: 'Urban Beats', initials: 'UB', genre: 'Hip-Hop', stats: { followers: 6543, tracks: 28, totalVotes: 4987 } },
  { id: '6', position: 6, name: 'Solar Flare', initials: 'SF', genre: 'Rock', stats: { followers: 5432, tracks: 21, totalVotes: 4321 } },
  { id: '7', position: 7, name: 'Velvet Sound', initials: 'VS', genre: 'Jazz', stats: { followers: 4321, tracks: 12, totalVotes: 3876 } },
  { id: '8', position: 8, name: 'Echo Valley', initials: 'EV', genre: 'Folk', stats: { followers: 3987, tracks: 19, totalVotes: 3234 } },
]

const mockCurators: RankedCurator[] = [
  { id: '1', position: 1, name: 'Mariana Lima', initials: 'ML', stats: { recommendations: 156, totalVotes: 4521, followers: 2341 } },
  { id: '2', position: 2, name: 'Rafael Costa', initials: 'RC', stats: { recommendations: 132, totalVotes: 3892, followers: 1987 } },
  { id: '3', position: 3, name: 'Julia Ferreira', initials: 'JF', stats: { recommendations: 98, totalVotes: 3234, followers: 1654 } },
  { id: '4', position: 4, name: 'Carlos Silva', initials: 'CS', stats: { recommendations: 87, totalVotes: 2876, followers: 1432 } },
  { id: '5', position: 5, name: 'Ana Paula', initials: 'AP', stats: { recommendations: 76, totalVotes: 2543, followers: 1234 } },
  { id: '6', position: 6, name: 'Pedro Henrique', initials: 'PH', stats: { recommendations: 65, totalVotes: 2187, followers: 987 } },
  { id: '7', position: 7, name: 'Beatriz Santos', initials: 'BS', stats: { recommendations: 54, totalVotes: 1876, followers: 876 } },
  { id: '8', position: 8, name: 'Lucas Oliveira', initials: 'LO', stats: { recommendations: 48, totalVotes: 1654, followers: 765 } },
]

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/trending', label: 'Em Alta', icon: Zap },
  { href: '/rankings', label: 'Rankings', icon: BarChart3, active: true },
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

function PositionBadge({ position }: { position: number }) {
  if (position === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
        <Crown className="w-4 h-4 text-yellow-500" />
      </div>
    )
  }
  if (position === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400/20">
        <Medal className="w-4 h-4 text-gray-400" />
      </div>
    )
  }
  if (position === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20">
        <Medal className="w-4 h-4 text-amber-700" />
      </div>
    )
  }
  return (
    <span className="text-lg font-bold text-muted-foreground tabular-nums w-8 text-center">
      {position}
    </span>
  )
}

function MusicRankingTable({ data, viewMode }: { data: RankedMusic[]; viewMode: string }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((music) => (
          <Card key={music.id} className="group cursor-pointer hover:ring-2 ring-primary/50 transition-all">
            <CardContent className="p-4">
              <div className="relative mb-3">
                <div className="aspect-square rounded-lg bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                  {music.coverUrl ? (
                    <img src={music.coverUrl} alt={music.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-12 h-12 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                    music.position === 1 && "bg-yellow-500 text-black",
                    music.position === 2 && "bg-gray-400 text-black",
                    music.position === 3 && "bg-amber-700 text-white",
                    music.position > 3 && "bg-muted text-muted-foreground"
                  )}>
                    {music.position}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold truncate">{music.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{music.artist}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {music.stats.upvotes.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  {music.stats.plays.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Música</TableHead>
            <TableHead className="hidden md:table-cell">Gênero</TableHead>
            <TableHead className="text-right">Votos</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Plays</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Comentários</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((music) => (
            <TableRow key={music.id} className="group cursor-pointer hover:bg-muted/50">
              <TableCell>
                <PositionBadge position={music.position} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-md bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {music.coverUrl ? (
                      <img src={music.coverUrl} alt={music.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 text-white" />
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
              <TableCell className="text-right font-medium">
                {music.stats.upvotes.toLocaleString()}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                {music.stats.plays.toLocaleString()}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                {music.stats.comments}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                    <DropdownMenuItem>Adicionar aos favoritos</DropdownMenuItem>
                    <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function ArtistRankingTable({ data, viewMode }: { data: RankedArtist[]; viewMode: string }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((artist) => (
          <Card key={artist.id} className="group cursor-pointer hover:ring-2 ring-primary/50 transition-all">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block mb-3">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={artist.avatar} />
                  <AvatarFallback className="text-xl bg-linear-to-br from-emerald-500 to-blue-600 text-white">
                    {artist.initials}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  artist.position === 1 && "bg-yellow-500 text-black",
                  artist.position === 2 && "bg-gray-400 text-black",
                  artist.position === 3 && "bg-amber-700 text-white",
                  artist.position > 3 && "bg-muted text-muted-foreground"
                )}>
                  {artist.position}
                </div>
              </div>
              <h3 className="font-semibold">{artist.name}</h3>
              <p className="text-sm text-muted-foreground">{artist.genre}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{artist.stats.followers.toLocaleString()} seguidores</span>
                <span>{artist.stats.tracks} músicas</span>
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                Seguir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Artista</TableHead>
            <TableHead className="hidden md:table-cell">Gênero</TableHead>
            <TableHead className="text-right">Seguidores</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Músicas</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Votos Totais</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((artist) => (
            <TableRow key={artist.id} className="group cursor-pointer hover:bg-muted/50">
              <TableCell>
                <PositionBadge position={artist.position} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={artist.avatar} />
                    <AvatarFallback className="bg-linear-to-br from-emerald-500 to-blue-600 text-white">
                      {artist.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{artist.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant="outline">{artist.genre}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {artist.stats.followers.toLocaleString()}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                {artist.stats.tracks}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                {artist.stats.totalVotes.toLocaleString()}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Seguir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function CuratorRankingTable({ data, viewMode }: { data: RankedCurator[]; viewMode: string }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((curator) => (
          <Card key={curator.id} className="group cursor-pointer hover:ring-2 ring-primary/50 transition-all">
            <CardContent className="p-4 text-center">
              <div className="relative inline-block mb-3">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={curator.avatar} />
                  <AvatarFallback className="text-xl bg-linear-to-br from-pink-500 to-orange-500 text-white">
                    {curator.initials}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  curator.position === 1 && "bg-yellow-500 text-black",
                  curator.position === 2 && "bg-gray-400 text-black",
                  curator.position === 3 && "bg-amber-700 text-white",
                  curator.position > 3 && "bg-muted text-muted-foreground"
                )}>
                  {curator.position}
                </div>
              </div>
              <h3 className="font-semibold">{curator.name}</h3>
              <p className="text-sm text-muted-foreground">{curator.stats.recommendations} recomendações</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>{curator.stats.totalVotes.toLocaleString()} votos</span>
                <span>{curator.stats.followers.toLocaleString()} seguidores</span>
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                Seguir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Curador</TableHead>
            <TableHead className="text-right">Recomendações</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Votos Recebidos</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Seguidores</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((curator) => (
            <TableRow key={curator.id} className="group cursor-pointer hover:bg-muted/50">
              <TableCell>
                <PositionBadge position={curator.position} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={curator.avatar} />
                    <AvatarFallback className="bg-linear-to-br from-pink-500 to-orange-500 text-white">
                      {curator.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{curator.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {curator.stats.recommendations}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                {curator.stats.totalVotes.toLocaleString()}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                {curator.stats.followers.toLocaleString()}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Seguir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default function RankingsPage() {
  const [period, setPeriod] = useState('month')
  const [genre, setGenre] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [activeTab, setActiveTab] = useState('musics')

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
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Rankings</h1>
            </div>
            <p className="text-muted-foreground">
              Os melhores da comunidade por período e categoria
            </p>
          </section>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="musics" className="gap-2">
                  <Music className="w-4 h-4" />
                  Músicas
                </TabsTrigger>
                <TabsTrigger value="artists" className="gap-2">
                  <Mic2 className="w-4 h-4" />
                  Artistas
                </TabsTrigger>
                <TabsTrigger value="curators" className="gap-2">
                  <UserCircle className="w-4 h-4" />
                  Curadores
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
                  <ToggleGroupItem value="list" aria-label="Lista">
                    <LayoutList className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grade">
                    <LayoutGrid className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Filters */}
            <section className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase">Período</span>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-40">
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

              {activeTab === 'musics' && (
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
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex-1" />

              <Button variant="outline" size="sm">
                Limpar Filtros
              </Button>
            </section>

            {/* Content */}
            <TabsContent value="musics" className="mt-0">
              <MusicRankingTable data={mockMusics} viewMode={viewMode} />
            </TabsContent>

            <TabsContent value="artists" className="mt-0">
              <ArtistRankingTable data={mockArtists} viewMode={viewMode} />
            </TabsContent>

            <TabsContent value="curators" className="mt-0">
              <CuratorRankingTable data={mockCurators} viewMode={viewMode} />
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">1-10</span> de{' '}
              <span className="font-medium text-foreground">100</span> resultados
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </div>
    </div>
  )
}