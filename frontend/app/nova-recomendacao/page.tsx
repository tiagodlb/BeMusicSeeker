'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'text-muted-foreground hover:bg-accent hover:text-foreground'
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
        <Button asChild className="w-full bg-primary/10 text-primary hover:bg-primary/20">
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

export default function NovaRecomendacaoPage() {
  const router = useRouter()
  const [musicTitle, setMusicTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!musicTitle.trim() || !artist.trim() || !description.trim() || !genre) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implementar chamada à API
      // const response = await fetch('/api/recommendations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     title: musicTitle,
      //     artist,
      //     genre,
      //     description,
      //     tags: selectedTags,
      //   }),
      // })

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirecionar para dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao criar recomendação:', error)
      alert('Erro ao criar recomendação. Tente novamente.')
      setIsLoading(false)
    }
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
          {/* Page Title */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Nova Recomendação
            </h1>
            <p className="text-muted-foreground">
              Compartilhe sua descoberta musical com a comunidade
            </p>
          </section>

          {/* Form Card */}
          <Card className="max-w-2xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Detalhes da Música</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Preencha as informações sobre a música que deseja recomendar
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Título da Música *
                  </label>
                  <Input
                    id="title"
                    placeholder="Ex: Neon Dreams"
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Artist */}
                <div>
                  <label htmlFor="artist" className="block text-sm font-medium mb-2">
                    Artista *
                  </label>
                  <Input
                    id="artist"
                    placeholder="Ex: Midnight Runners"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                  />
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium mb-2">
                    Gênero *
                  </label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Descrição / Por que recomenda? *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Compartilhe o que torna essa música especial para você..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo 500 caracteres
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Tags (Selecione pelo menos uma)
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {[
                        'para-estudar',
                        'festa',
                        'relaxante',
                        'energético',
                        'melancólico',
                        'indie',
                        'clássico',
                        'descoberta',
                      ].map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? 'default' : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            if (selectedTags.includes(tag)) {
                              handleRemoveTag(tag)
                            } else {
                              handleAddTag(tag)
                            }
                          }}
                        >
                          {selectedTags.includes(tag) && (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          Tags selecionadas:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              #{tag}
                              <X
                                className="w-3 h-3 cursor-pointer hover:opacity-70"
                                onClick={() => handleRemoveTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Publicar Recomendação
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Section */}
          <section className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">💡 Dica</h3>
                <p className="text-sm text-muted-foreground">
                  Quanto mais detalhada sua descrição, mais pessoas se interessarão
                  por sua recomendação.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🏷️ Tags</h3>
                <p className="text-sm text-muted-foreground">
                  Use tags para categorizar sua música e facilitar descobertas de
                  outros usuários.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">⭐ Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Recomendações de qualidade recebem mais votações e visibilidade.
                </p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

// Icon component for check
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
