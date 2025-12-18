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
  UserPlus,
  UserMinus,
  UserCheck,
  ExternalLink,
  ThumbsUp,
  Mic2,
  Sparkles
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

interface FollowedUser {
  id: string
  name: string
  username: string
  avatar?: string
  initials: string
  bio: string
  type: 'curador' | 'artista' | 'ouvinte'
  stats: {
    followers: number
    recommendations: number
  }
  isFollowing: boolean
}

interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar?: string
  initials: string
  bio: string
  type: 'curador' | 'artista' | 'ouvinte'
  stats: {
    followers: number
    recommendations: number
  }
  mutualFollowers: number
}

const mockFollowing: FollowedUser[] = [
  { id: '1', name: 'Mariana Lima', username: 'marilima', initials: 'ML', bio: 'Curadora musical apaixonada por synthwave e indie. Sempre em busca de novos sons.', type: 'curador', stats: { followers: 2341, recommendations: 156 }, isFollowing: true },
  { id: '2', name: 'Rafael Costa', username: 'rafaelcosta', initials: 'RC', bio: 'Produtor musical independente. MPB contemporânea com influências eletrônicas.', type: 'artista', stats: { followers: 1987, recommendations: 42 }, isFollowing: true },
  { id: '3', name: 'Julia Ferreira', username: 'juferreira', initials: 'JF', bio: 'Exploradora de gêneros. Do jazz ao hip-hop, sempre com bom gosto.', type: 'curador', stats: { followers: 1654, recommendations: 98 }, isFollowing: true },
  { id: '4', name: 'Carlos Silva', username: 'carlosmusic', initials: 'CS', bio: 'Guitarrista e compositor. Rock progressivo e experimental.', type: 'artista', stats: { followers: 3421, recommendations: 28 }, isFollowing: true },
  { id: '5', name: 'Ana Paula', username: 'anapmusic', initials: 'AP', bio: 'Amante de MPB e bossa nova. Compartilhando as melhores descobertas.', type: 'curador', stats: { followers: 876, recommendations: 76 }, isFollowing: true },
  { id: '6', name: 'Pedro Henrique', username: 'pedroh', initials: 'PH', bio: 'DJ e produtor de música eletrônica. Techno, house e tudo mais.', type: 'artista', stats: { followers: 2156, recommendations: 34 }, isFollowing: true },
]

const mockFollowers: FollowedUser[] = [
  { id: '7', name: 'Beatriz Santos', username: 'beasantos', initials: 'BS', bio: 'Ouvinte ávida. Sempre em busca de novas recomendações.', type: 'ouvinte', stats: { followers: 234, recommendations: 12 }, isFollowing: false },
  { id: '8', name: 'Lucas Oliveira', username: 'lucasoliveira', initials: 'LO', bio: 'Fã de rock clássico e alternativo. Led Zeppelin forever.', type: 'curador', stats: { followers: 567, recommendations: 48 }, isFollowing: true },
  { id: '9', name: 'Fernanda Costa', username: 'fecosta', initials: 'FC', bio: 'Cantora e compositora. Pop brasileiro com alma.', type: 'artista', stats: { followers: 1234, recommendations: 23 }, isFollowing: false },
  { id: '10', name: 'Roberto Almeida', username: 'robertoalmeida', initials: 'RA', bio: 'Professor de música. Clássico e jazz são minhas paixões.', type: 'curador', stats: { followers: 432, recommendations: 87 }, isFollowing: true },
  { id: '11', name: 'Camila Rocha', username: 'camilarocha', initials: 'CR', bio: 'Explorando o underground brasileiro.', type: 'ouvinte', stats: { followers: 156, recommendations: 5 }, isFollowing: false },
]

const mockSuggestions: SuggestedUser[] = [
  { id: '12', name: 'Thiago Mendes', username: 'thiagomendes', initials: 'TM', bio: 'Produtor de lo-fi e chillhop. Beats para relaxar.', type: 'artista', stats: { followers: 4521, recommendations: 67 }, mutualFollowers: 5 },
  { id: '13', name: 'Isabella Souza', username: 'bellasouza', initials: 'IS', bio: 'Curadora de playlists. Especialista em descobrir talentos.', type: 'curador', stats: { followers: 2876, recommendations: 234 }, mutualFollowers: 8 },
  { id: '14', name: 'Gabriel Santos', username: 'gabrielsantos', initials: 'GS', bio: 'Rapper e poeta urbano. Letras que contam histórias.', type: 'artista', stats: { followers: 5643, recommendations: 45 }, mutualFollowers: 3 },
  { id: '15', name: 'Letícia Gomes', username: 'leticiagomes', initials: 'LG', bio: 'Apaixonada por indie brasileiro e internacional.', type: 'curador', stats: { followers: 1234, recommendations: 156 }, mutualFollowers: 6 },
]

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/trending', label: 'Em Alta', icon: Zap },
  { href: '/rankings', label: 'Rankings', icon: BarChart3 },
  { href: '/explorar', label: 'Explorar Gêneros', icon: Compass },
]

const libraryItems = [
  { href: '/favoritos', label: 'Meus Favoritos', icon: Heart },
  { href: '/seguindo', label: 'Seguindo', icon: Users, active: true },
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

function UserTypeBadge({ type }: { type: 'curador' | 'artista' | 'ouvinte' }) {
  const config = {
    curador: { label: 'Curador', className: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' },
    artista: { label: 'Artista', className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' },
    ouvinte: { label: 'Ouvinte', className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
  }
  
  return (
    <Badge variant="secondary" className={config[type].className}>
      {type === 'artista' && <Mic2 className="w-3 h-3 mr-1" />}
      {config[type].label}
    </Badge>
  )
}

function UserCard({ 
  user, 
  onToggleFollow,
  showUnfollowConfirm = false
}: { 
  user: FollowedUser
  onToggleFollow: (id: string) => void
  showUnfollowConfirm?: boolean
}) {
  const FollowButton = () => {
    if (user.isFollowing && showUnfollowConfirm) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Seguindo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deixar de seguir {user.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                Você não verá mais as recomendações de {user.name} no seu feed. Você pode seguir novamente a qualquer momento.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onToggleFollow(user.id)}>
                Deixar de seguir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    return (
      <Button 
        variant={user.isFollowing ? "outline" : "default"} 
        size="sm" 
        className="gap-2"
        onClick={() => onToggleFollow(user.id)}
      >
        {user.isFollowing ? (
          <>
            <UserCheck className="w-4 h-4" />
            Seguindo
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Seguir
          </>
        )}
      </Button>
    )
  }

  return (
    <Card className="group hover:ring-2 ring-primary/50 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Link href={`/perfil/${user.username}`}>
            <Avatar className="w-14 h-14 cursor-pointer hover:ring-2 ring-primary/50 transition-all">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={cn(
                "text-white",
                user.type === 'artista' && "bg-linear-to-br from-blue-500 to-cyan-500",
                user.type === 'curador' && "bg-linear-to-br from-purple-500 to-pink-500",
                user.type === 'ouvinte' && "bg-linear-to-br from-green-500 to-emerald-500",
              )}>
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/perfil/${user.username}`} className="font-semibold hover:underline truncate">
                {user.name}
              </Link>
              <UserTypeBadge type={user.type} />
            </div>
            <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{user.bio}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {user.stats.followers.toLocaleString()} seguidores
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {user.stats.recommendations} recomendações
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FollowButton />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/perfil/${user.username}`} className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Bloquear usuário
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SuggestionCard({ 
  user, 
  onFollow 
}: { 
  user: SuggestedUser
  onFollow: (id: string) => void
}) {
  return (
    <Card className="group hover:ring-2 ring-primary/50 transition-all">
      <CardContent className="p-4 text-center">
        <Link href={`/perfil/${user.username}`}>
          <Avatar className="w-16 h-16 mx-auto mb-3 cursor-pointer hover:ring-2 ring-primary/50 transition-all">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className={cn(
              "text-white text-lg",
              user.type === 'artista' && "bg-linear-to-br from-blue-500 to-cyan-500",
              user.type === 'curador' && "bg-linear-to-br from-purple-500 to-pink-500",
              user.type === 'ouvinte' && "bg-linear-to-br from-green-500 to-emerald-500",
            )}>
              {user.initials}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <Link href={`/perfil/${user.username}`} className="font-semibold hover:underline">
          {user.name}
        </Link>
        <p className="text-xs text-muted-foreground mb-2">@{user.username}</p>
        
        <UserTypeBadge type={user.type} />
        
        <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{user.bio}</p>
        
        <p className="text-xs text-muted-foreground mt-2">
          {user.mutualFollowers} seguidores em comum
        </p>
        
        <Button 
          size="sm" 
          className="w-full mt-3 gap-2"
          onClick={() => onFollow(user.id)}
        >
          <UserPlus className="w-4 h-4" />
          Seguir
        </Button>
      </CardContent>
    </Card>
  )
}

export default function SeguindoPage() {
  const [following, setFollowing] = useState(mockFollowing)
  const [followers, setFollowers] = useState(mockFollowers)
  const [suggestions, setSuggestions] = useState(mockSuggestions)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const handleToggleFollow = (id: string) => {
    setFollowing(prev => prev.map(user => 
      user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
    ))
    setFollowers(prev => prev.map(user => 
      user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
    ))
  }

  const handleFollowSuggestion = (id: string) => {
    const suggested = suggestions.find(s => s.id === id)
    if (suggested) {
      setFollowing(prev => [...prev, { ...suggested, isFollowing: true }])
      setSuggestions(prev => prev.filter(s => s.id !== id))
    }
  }

  const filteredFollowing = following.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFollowers = followers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Conexões</h1>
            </div>
            <p className="text-muted-foreground">
              Gerencie as pessoas que você segue e seus seguidores
            </p>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content - Following/Followers */}
            <div className="xl:col-span-2">
              <Tabs defaultValue="following" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <TabsList>
                    <TabsTrigger value="following" className="gap-2">
                      Seguindo
                      <Badge variant="secondary" className="ml-1">{following.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="followers" className="gap-2">
                      Seguidores
                      <Badge variant="secondary" className="ml-1">{followers.length}</Badge>
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Mais Recentes</SelectItem>
                        <SelectItem value="name">Nome (A-Z)</SelectItem>
                        <SelectItem value="followers">Mais Seguidores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="search"
                    placeholder="Buscar pessoas..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <TabsContent value="following" className="mt-0 space-y-4">
                  {filteredFollowing.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchQuery ? 'Nenhum resultado encontrado' : 'Você ainda não segue ninguém'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? 'Tente buscar por outro nome ou usuário.'
                          : 'Comece a seguir pessoas para ver suas recomendações no feed.'
                        }
                      </p>
                      {!searchQuery && (
                        <Button asChild>
                          <Link href="/explorar">Explorar pessoas</Link>
                        </Button>
                      )}
                    </Card>
                  ) : (
                    filteredFollowing.map(user => (
                      <UserCard 
                        key={user.id} 
                        user={user} 
                        onToggleFollow={handleToggleFollow}
                        showUnfollowConfirm
                      />
                    ))
                  )}
                </TabsContent>

                <TabsContent value="followers" className="mt-0 space-y-4">
                  {filteredFollowers.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchQuery ? 'Nenhum resultado encontrado' : 'Você ainda não tem seguidores'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery 
                          ? 'Tente buscar por outro nome ou usuário.'
                          : 'Compartilhe suas recomendações para atrair seguidores.'
                        }
                      </p>
                      {!searchQuery && (
                        <Button asChild>
                          <Link href="/nova-recomendacao">Criar recomendação</Link>
                        </Button>
                      )}
                    </Card>
                  ) : (
                    filteredFollowers.map(user => (
                      <UserCard 
                        key={user.id} 
                        user={user} 
                        onToggleFollow={handleToggleFollow}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Suggestions */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">Sugestões para você</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Baseado em quem você segue
                </p>
                
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                  {suggestions.map(user => (
                    <SuggestionCard 
                      key={user.id} 
                      user={user} 
                      onFollow={handleFollowSuggestion}
                    />
                  ))}
                </div>

                {suggestions.length > 0 && (
                  <Button variant="outline" className="w-full mt-4">
                    Ver mais sugestões
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}