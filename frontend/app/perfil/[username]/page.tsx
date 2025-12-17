'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  LinkIcon,
  Edit3,
  UserPlus,
  UserMinus,
  Mic2,
  Award,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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

interface UserProfile {
  id: string
  name: string
  username: string
  avatar?: string
  initials: string
  bio: string
  location?: string
  website?: string
  joinedAt: string
  type: 'curador' | 'artista' | 'ouvinte'
  isFollowing: boolean
  isOwnProfile: boolean
  stats: {
    followers: number
    following: number
    recommendations: number
    totalVotes: number
  }
}

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
    genre: string
  }
  description: string
  tags: string[]
  stats: {
    upvotes: number
    downvotes: number
    comments: number
  }
  userVote: 'up' | 'down' | null
}

interface FollowUser {
  id: string
  name: string
  username: string
  avatar?: string
  initials: string
  type: 'curador' | 'artista' | 'ouvinte'
  isFollowing: boolean
}

const mockProfile: UserProfile = {
  id: '1',
  name: 'Maria Silva',
  username: 'mariasilva',
  initials: 'MS',
  bio: 'Apaixonada por música indie e MPB. Curadora há 3 anos, sempre em busca de sons novos e artistas independentes que merecem ser descobertos.',
  location: 'São Paulo, SP',
  website: 'mariasilva.com',
  joinedAt: 'Março 2022',
  type: 'curador',
  isFollowing: false,
  isOwnProfile: false,
  stats: {
    followers: 1842,
    following: 234,
    recommendations: 156,
    totalVotes: 4521,
  },
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    user: { name: 'Maria Silva', initials: 'MS', profileUrl: '/perfil/mariasilva' },
    timestamp: '2 horas atrás',
    music: { title: 'Neon Dreams', artist: 'Aurora Beats', duration: '3:45', genre: 'Indie' },
    description: 'Descobri essa artista recentemente e não consigo parar de ouvir. A produção é impecável e a voz dela é hipnotizante.',
    tags: ['indie', 'descoberta', 'chill'],
    stats: { upvotes: 234, downvotes: 3, comments: 18 },
    userVote: null,
  },
  {
    id: '2',
    user: { name: 'Maria Silva', initials: 'MS', profileUrl: '/perfil/mariasilva' },
    timestamp: '1 dia atrás',
    music: { title: 'Tarde em Ipanema', artist: 'João Gilberto', duration: '4:12', genre: 'MPB' },
    description: 'Um clássico absoluto. A bossa nova no seu mais puro estado.',
    tags: ['mpb', 'clássico', 'bossa-nova'],
    stats: { upvotes: 456, downvotes: 2, comments: 32 },
    userVote: 'up',
  },
]

const mockFollowers: FollowUser[] = [
  { id: '1', name: 'João Santos', username: 'joaosantos', initials: 'JS', type: 'ouvinte', isFollowing: true },
  { id: '2', name: 'Ana Costa', username: 'anacosta', initials: 'AC', type: 'curador', isFollowing: false },
  { id: '3', name: 'Pedro Lima', username: 'pedrolima', initials: 'PL', type: 'artista', isFollowing: true },
]

const mockFollowing: FollowUser[] = [
  { id: '4', name: 'Lucas Oliveira', username: 'lucasoliveira', initials: 'LO', type: 'artista', isFollowing: true },
  { id: '5', name: 'Beatriz Mendes', username: 'biamendes', initials: 'BM', type: 'curador', isFollowing: true },
]

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
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
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Menu</p>
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
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Biblioteca</p>
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
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm">TS</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Tiago Silva</p>
                <p className="text-xs text-muted-foreground">Curador</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild><Link href="/perfil/tiagosilva">Meu Perfil</Link></DropdownMenuItem>
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
    curador: { label: 'Curador', className: 'bg-purple-500/10 text-purple-500' },
    artista: { label: 'Artista', className: 'bg-blue-500/10 text-blue-500' },
    ouvinte: { label: 'Ouvinte', className: 'bg-green-500/10 text-green-500' },
  }
  return (
    <Badge variant="secondary" className={config[type].className}>
      {type === 'artista' && <Mic2 className="w-3 h-3 mr-1" />}
      {type === 'curador' && <Award className="w-3 h-3 mr-1" />}
      {config[type].label}
    </Badge>
  )
}

function RecommendationCard({ data, onVote }: { data: Recommendation; onVote: (id: string, type: 'up' | 'down') => void }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-blue-600 text-white">{data.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={data.user.profileUrl} className="text-sm font-medium hover:underline">{data.user.name}</Link>
            <p className="text-xs text-muted-foreground">{data.timestamp}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
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

      <CardContent className="pt-0">
        <div className="flex gap-4 mb-4">
          <div className="w-24 h-24 rounded-lg bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shrink-0">
            <Music className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{data.music.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{data.music.artist}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {data.tags.map((tag) => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Button size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-primary rounded-full" />
          </div>
          <span className="text-xs text-muted-foreground">{data.music.duration}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex items-center gap-2 w-full">
          <Button variant={data.userVote === 'up' ? 'default' : 'ghost'} size="sm" className="gap-2" onClick={() => onVote(data.id, 'up')}>
            <ThumbsUp className="w-4 h-4" />{data.stats.upvotes}
          </Button>
          <Button variant={data.userVote === 'down' ? 'destructive' : 'ghost'} size="sm" className="gap-2" onClick={() => onVote(data.id, 'down')}>
            <ThumbsDown className="w-4 h-4" />{data.stats.downvotes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2"><MessageCircle className="w-4 h-4" />{data.stats.comments}</Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8"><Heart className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Share2 className="w-4 h-4" /></Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function FollowUserCard({ user, onToggleFollow }: { user: FollowUser; onToggleFollow: (id: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white">{user.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <Link href={`/perfil/${user.username}`} className="font-medium hover:underline block">{user.name}</Link>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
      <UserTypeBadge type={user.type} />
      <Button variant={user.isFollowing ? 'outline' : 'default'} size="sm" onClick={() => onToggleFollow(user.id)}>
        {user.isFollowing ? <><UserMinus className="w-4 h-4 mr-1" />Seguindo</> : <><UserPlus className="w-4 h-4 mr-1" />Seguir</>}
      </Button>
    </div>
  )
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string

  // TODO: fetch profile by username
  const isOwnProfile = username === 'tiagosilva'
  
  const [profile, setProfile] = useState<UserProfile>({ ...mockProfile, isOwnProfile, username: username || mockProfile.username })
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [followers, setFollowers] = useState(mockFollowers)
  const [following, setFollowing] = useState(mockFollowing)

  const handleFollow = () => {
    setProfile((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      stats: { ...prev.stats, followers: prev.isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1 },
    }))
  }

  const handleVote = (id: string, voteType: 'up' | 'down') => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec
        const currentVote = rec.userVote
        let newVote: 'up' | 'down' | null = voteType
        let upvoteDelta = 0, downvoteDelta = 0

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

        return { ...rec, userVote: newVote, stats: { ...rec.stats, upvotes: rec.stats.upvotes + upvoteDelta, downvotes: rec.stats.downvotes + downvoteDelta } }
      })
    )
  }

  const handleToggleFollowUser = (id: string) => {
    setFollowers((prev) => prev.map((u) => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u)))
    setFollowing((prev) => prev.map((u) => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u)))
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0"><SidebarContent /></SheetContent>
            </Sheet>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar músicas, artistas, pessoas..." className="pl-9" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Profile Header */}
          <section className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0">
                    <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white text-3xl">{profile.initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <h1 className="text-2xl font-bold">{profile.name}</h1>
                      <UserTypeBadge type={profile.type} />
                    </div>
                    <p className="text-muted-foreground mb-3">@{profile.username}</p>
                    <p className="text-sm mb-4 max-w-xl">{profile.bio}</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground mb-4">
                      {profile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</span>}
                      {profile.website && (
                        <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                          <LinkIcon className="w-4 h-4" />{profile.website}
                        </a>
                      )}
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Entrou em {profile.joinedAt}</span>
                    </div>

                    <div className="flex justify-center sm:justify-start gap-6 mb-4">
                      <button className="text-center hover:text-primary transition-colors">
                        <p className="text-xl font-bold">{profile.stats.followers.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Seguidores</p>
                      </button>
                      <button className="text-center hover:text-primary transition-colors">
                        <p className="text-xl font-bold">{profile.stats.following.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Seguindo</p>
                      </button>
                      <div className="text-center">
                        <p className="text-xl font-bold">{profile.stats.recommendations}</p>
                        <p className="text-xs text-muted-foreground">Recomendações</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">{profile.stats.totalVotes.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Votos</p>
                      </div>
                    </div>

                    <div className="flex justify-center sm:justify-start gap-3">
                      {profile.isOwnProfile ? (
                        <Button variant="outline"><Edit3 className="w-4 h-4 mr-2" />Editar Perfil</Button>
                      ) : (
                        <>
                          <Button variant={profile.isFollowing ? 'outline' : 'default'} onClick={handleFollow}>
                            {profile.isFollowing ? <><UserMinus className="w-4 h-4 mr-2" />Seguindo</> : <><UserPlus className="w-4 h-4 mr-2" />Seguir</>}
                          </Button>
                          <Button variant="outline"><MessageCircle className="w-4 h-4 mr-2" />Mensagem</Button>
                        </>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Compartilhar perfil</DropdownMenuItem>
                          <DropdownMenuItem>Copiar link</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Denunciar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tabs */}
          <Tabs defaultValue="recommendations">
            <TabsList className="mb-6">
              <TabsTrigger value="recommendations" className="gap-2"><Music className="w-4 h-4" />Recomendações</TabsTrigger>
              <TabsTrigger value="followers" className="gap-2"><Users className="w-4 h-4" />Seguidores</TabsTrigger>
              <TabsTrigger value="following" className="gap-2"><UserPlus className="w-4 h-4" />Seguindo</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => <RecommendationCard key={rec.id} data={rec} onVote={handleVote} />)
              ) : (
                <Card><CardContent className="py-12 text-center"><Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Nenhuma recomendação ainda</p></CardContent></Card>
              )}
            </TabsContent>

            <TabsContent value="followers">
              <Card>
                <CardContent className="p-2">
                  {followers.length > 0 ? (
                    followers.map((user) => <FollowUserCard key={user.id} user={user} onToggleFollow={handleToggleFollowUser} />)
                  ) : (
                    <div className="py-12 text-center"><Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Nenhum seguidor ainda</p></div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="following">
              <Card>
                <CardContent className="p-2">
                  {following.length > 0 ? (
                    following.map((user) => <FollowUserCard key={user.id} user={user} onToggleFollow={handleToggleFollowUser} />)
                  ) : (
                    <div className="py-12 text-center"><Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Não está seguindo ninguém</p></div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}