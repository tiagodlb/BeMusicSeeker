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
  Pause,
  Headphones,
  LayoutList,
  LayoutGrid,
  X,
  Clock,
  Calendar,
  Trash2,
  Share2,
  ListMusic
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface FavoriteMusic {
  id: string
  title: string
  artist: string
  coverUrl?: string
  genre: string
  duration: string
  plays: number
  addedAt: string
}

const mockFavorites: FavoriteMusic[] = [
  { id: '1', title: 'Neon Dreams', artist: 'Midnight Runners', genre: 'Synthwave', duration: '4:02', plays: 1247, addedAt: '2 dias atrás' },
  { id: '2', title: 'Céu de Santo Amaro', artist: 'Flávio Venturini', genre: 'MPB', duration: '5:18', plays: 892, addedAt: '3 dias atrás' },
  { id: '3', title: 'Electric Feel', artist: 'MGMT', genre: 'Indie', duration: '3:49', plays: 2341, addedAt: '1 semana atrás' },
  { id: '4', title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', duration: '3:20', plays: 8923, addedAt: '1 semana atrás' },
  { id: '5', title: 'Aquarela', artist: 'Toquinho', genre: 'MPB', duration: '4:45', plays: 567, addedAt: '2 semanas atrás' },
  { id: '6', title: 'Redbone', artist: 'Childish Gambino', genre: 'R&B', duration: '5:26', plays: 4123, addedAt: '2 semanas atrás' },
  { id: '7', title: 'Breathe', artist: 'Pink Floyd', genre: 'Rock', duration: '2:49', plays: 3456, addedAt: '3 semanas atrás' },
  { id: '8', title: 'Alright', artist: 'Kendrick Lamar', genre: 'Hip-Hop', duration: '3:39', plays: 5678, addedAt: '1 mês atrás' },
  { id: '9', title: 'Strobe', artist: 'deadmau5', genre: 'Eletrônica', duration: '10:37', plays: 2987, addedAt: '1 mês atrás' },
  { id: '10', title: 'Construção', artist: 'Chico Buarque', genre: 'MPB', duration: '6:23', plays: 1876, addedAt: '1 mês atrás' },
  { id: '11', title: 'Lofi Study Beat', artist: 'ChillHop Music', genre: 'Lofi', duration: '3:12', plays: 4521, addedAt: '2 meses atrás' },
  { id: '12', title: 'Take Five', artist: 'Dave Brubeck', genre: 'Jazz', duration: '5:24', plays: 2134, addedAt: '2 meses atrás' },
]

const genres = ['Todos', 'Synthwave', 'MPB', 'Indie', 'Pop', 'R&B', 'Rock', 'Hip-Hop', 'Eletrônica', 'Lofi', 'Jazz']

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/trending', label: 'Em Alta', icon: Zap },
  { href: '/rankings', label: 'Rankings', icon: BarChart3 },
  { href: '/explorar', label: 'Explorar Gêneros', icon: Compass },
]

const libraryItems = [
  { href: '/favoritos', label: 'Meus Favoritos', icon: Heart, active: true },
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
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

function FavoriteCard({ 
  music, 
  onRemove, 
  isPlaying, 
  onPlay 
}: { 
  music: FavoriteMusic
  onRemove: (id: string) => void
  isPlaying: boolean
  onPlay: (id: string) => void
}) {
  return (
    <Card className="group cursor-pointer hover:ring-2 ring-primary/50 transition-all overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <div className="w-full h-full bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
            {music.coverUrl ? (
              <img src={music.coverUrl} alt={music.title} className="w-full h-full object-cover" />
            ) : (
              <Music className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          
          {/* Overlay com botões */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              size="icon" 
              className="rounded-full h-12 w-12"
              onClick={() => onPlay(music.id)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
          </div>

          {/* Badge de gênero */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-black/60 hover:bg-black/60"
          >
            {music.genre}
          </Badge>

          {/* Botão remover */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover dos favoritos?</AlertDialogTitle>
                <AlertDialogDescription>
                  Você está prestes a remover "{music.title}" de {music.artist} dos seus favoritos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onRemove(music.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="p-4">
          <h3 className="font-semibold truncate">{music.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{music.artist}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Headphones className="w-3 h-3" />
              {music.plays.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {music.duration}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FavoriteRow({ 
  music, 
  onRemove, 
  isPlaying, 
  onPlay 
}: { 
  music: FavoriteMusic
  onRemove: (id: string) => void
  isPlaying: boolean
  onPlay: (id: string) => void
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div 
            className="relative w-12 h-12 rounded-md bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
            onClick={() => onPlay(music.id)}
          >
            {music.coverUrl ? (
              <img src={music.coverUrl} alt={music.title} className="w-full h-full object-cover" />
            ) : (
              <Music className="w-5 h-5 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
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
      <TableCell className="hidden sm:table-cell text-muted-foreground">
        {music.duration}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">
        <div className="flex items-center gap-1">
          <Headphones className="w-4 h-4" />
          {music.plays.toLocaleString()}
        </div>
      </TableCell>
      <TableCell className="hidden xl:table-cell text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {music.addedAt}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onPlay(music.id)}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListMusic className="w-4 h-4 mr-2" />
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover dos favoritos?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você está prestes a remover "{music.title}" de {music.artist} dos seus favoritos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onRemove(music.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)

  const handleRemove = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  const handlePlay = (id: string) => {
    setPlayingId(prev => prev === id ? null : id)
  }

  const filteredFavorites = favorites.filter(music => {
    const matchesGenre = selectedGenre === 'Todos' || music.genre === selectedGenre
    const matchesSearch = music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          music.artist.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGenre && matchesSearch
  })

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'artist':
        return a.artist.localeCompare(b.artist)
      case 'plays':
        return b.plays - a.plays
      default:
        return 0
    }
  })

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
              <div className="p-2 rounded-lg bg-red-500/10">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Meus Favoritos</h1>
            </div>
            <p className="text-muted-foreground">
              {favorites.length} músicas salvas na sua coleção
            </p>
          </section>

          {/* Genre Filter Chips */}
          <section className="mb-6">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className="rounded-full"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </section>

          {/* Filters Bar */}
          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Buscar nos favoritos..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Ordenar</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                  <SelectItem value="title">Título (A-Z)</SelectItem>
                  <SelectItem value="artist">Artista (A-Z)</SelectItem>
                  <SelectItem value="plays">Mais Tocadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

            <p className="text-sm text-muted-foreground hidden sm:block">
              Mostrando <span className="font-medium text-foreground">{sortedFavorites.length}</span> de{' '}
              <span className="font-medium text-foreground">{favorites.length}</span>
            </p>

            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
              <ToggleGroupItem value="grid" aria-label="Grade">
                <LayoutGrid className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Lista">
                <LayoutList className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </section>

          {/* Content */}
          {sortedFavorites.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum favorito encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedGenre !== 'Todos' 
                  ? 'Tente ajustar seus filtros ou busca.'
                  : 'Comece a salvar músicas que você gosta para vê-las aqui.'
                }
              </p>
              {(searchQuery || selectedGenre !== 'Todos') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedGenre('Todos')
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedFavorites.map((music) => (
                <FavoriteCard 
                  key={music.id} 
                  music={music} 
                  onRemove={handleRemove}
                  isPlaying={playingId === music.id}
                  onPlay={handlePlay}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Música</TableHead>
                    <TableHead className="hidden md:table-cell">Gênero</TableHead>
                    <TableHead className="hidden sm:table-cell">Duração</TableHead>
                    <TableHead className="hidden lg:table-cell">Plays</TableHead>
                    <TableHead className="hidden xl:table-cell">Adicionado</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFavorites.map((music) => (
                    <FavoriteRow 
                      key={music.id} 
                      music={music} 
                      onRemove={handleRemove}
                      isPlaying={playingId === music.id}
                      onPlay={handlePlay}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}