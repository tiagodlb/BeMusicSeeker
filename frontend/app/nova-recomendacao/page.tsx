'use client'

import { useState, useMemo } from 'react'
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
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Check,
  Loader2,
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
import { Checkbox } from '@/components/ui/checkbox'

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
  'R&B',
  'Metal',
  'Funk',
  'Country',
  'Lo-Fi',
  'Soul',
]

const availableTags = [
  'para-estudar',
  'festa',
  'relaxante',
  'energético',
  'melancólico',
  'indie',
  'clássico',
  'descoberta',
  'viral',
  'trending',
  'feel-good',
  'nostalgia',
  'motivação',
  'meditação',
  'road-trip',
  'dança',
  'soul',
  'alternative',
  'electro',
  'lo-fi',
  'acoustic',
  'uplifting',
  'dark',
  'experimental',
  'chill',
  'workout',
  'party',
  'romantic',
  'underground',
  'hit',
  'ost',
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
            <DropdownMenuItem asChild>
              <Link href="/perfil/tiagosilva">Meu Perfil</Link>
            </DropdownMenuItem>
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

  // Form state
  const [musicTitle, setMusicTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [mediaType, setMediaType] = useState<'url' | 'upload'>('url')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      musicTitle.trim().length > 0 &&
      artist.trim().length > 0 &&
      genre !== '' &&
      description.trim().length >= 50 &&
      selectedTags.length > 0 &&
      (mediaUrl.trim() !== '' || mediaFile !== null) &&
      acceptedTerms
    )
  }, [musicTitle, artist, genre, description, selectedTags, mediaUrl, mediaFile, acceptedTerms])

  const validateField = (field: string) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'title':
        if (!musicTitle.trim()) newErrors.title = 'Título é obrigatório'
        else delete newErrors.title
        break
      case 'artist':
        if (!artist.trim()) newErrors.artist = 'Artista é obrigatório'
        else delete newErrors.artist
        break
      case 'genre':
        if (!genre) newErrors.genre = 'Selecione um gênero'
        else delete newErrors.genre
        break
      case 'description':
        if (!description.trim()) newErrors.description = 'Descrição é obrigatória'
        else if (description.length < 50) newErrors.description = 'Mínimo 50 caracteres'
        else if (description.length > 500) newErrors.description = 'Máximo 500 caracteres'
        else delete newErrors.description
        break
      case 'tags':
        if (selectedTags.length === 0) newErrors.tags = 'Selecione pelo menos uma tag'
        else delete newErrors.tags
        break
      case 'media':
        if (!mediaUrl.trim() && !mediaFile) newErrors.media = 'Adicione um link ou arquivo de mídia'
        else delete newErrors.media
        break
    }

    setErrors(newErrors)
  }

  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    validateField(field)
  }

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleMediaUrlChange = (url: string) => {
    setMediaUrl(url)
    if (url.trim()) {
      setMediaPreview(getEmbedUrl(url))
      setErrors((prev) => {
        const { media, ...rest } = prev
        return rest
      })
    } else {
      setMediaPreview(null)
    }
  }

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setErrors({ ...errors, media: 'Arquivo muito grande (máx 50MB)' })
        return
      }
      setMediaFile(file)
      setMediaUrl('')
      setMediaPreview(null)
      setErrors((prev) => {
        const { media, ...rest } = prev
        return rest
      })
    }
  }

  const getEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYoutubeId(url)
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    // Spotify
    if (url.includes('spotify.com/track/')) {
      const trackId = url.split('/track/')[1]?.split('?')[0]
      if (trackId) return `https://open.spotify.com/embed/track/${trackId}`
    }
    return url
  }

  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match?.[1]) return match[1]
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    ;['title', 'artist', 'genre', 'description', 'tags', 'media'].forEach(validateField)
    setTouched({ title: true, artist: true, genre: true, description: true, tags: true, media: true })

    if (!isFormValid) return

    setIsLoading(true)

    try {
      // TODO: integrate with API
      // await createRecommendation({ title: musicTitle, artist, genre, description, tags: selectedTags, mediaUrl })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push('/dashboard?success=recommendation')
    } catch (error) {
      console.error('Erro ao criar recomendação:', error)
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
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
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
                <Input type="search" placeholder="Buscar músicas, artistas..." className="pl-9" />
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
          {/* Page Title */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Nova Recomendação</h1>
            <p className="text-muted-foreground">Compartilhe sua descoberta musical com a comunidade</p>
          </section>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl">
            {/* Form Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h2 className="text-xl font-semibold">Detalhes da Música</h2>
                <p className="text-sm text-muted-foreground">Preencha as informações sobre a música que deseja recomendar</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Título da Música *
                      </label>
                      {touched.title && !errors.title && musicTitle.trim() && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <Input
                      id="title"
                      placeholder="Ex: Neon Dreams"
                      value={musicTitle}
                      onChange={(e) => setMusicTitle(e.target.value)}
                      onBlur={() => handleFieldBlur('title')}
                      className={cn(touched.title && errors.title && 'border-red-500 focus-visible:ring-red-500')}
                    />
                    {touched.title && errors.title && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Artist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="artist" className="text-sm font-medium">
                        Artista *
                      </label>
                      {touched.artist && !errors.artist && artist.trim() && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <Input
                      id="artist"
                      placeholder="Ex: Aurora Beats"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      onBlur={() => handleFieldBlur('artist')}
                      className={cn(touched.artist && errors.artist && 'border-red-500 focus-visible:ring-red-500')}
                    />
                    {touched.artist && errors.artist && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.artist}
                      </p>
                    )}
                  </div>

                  {/* Genre */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Gênero *</label>
                      {touched.genre && !errors.genre && genre && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <Select value={genre} onValueChange={(v) => { setGenre(v); setTouched({ ...touched, genre: true }) }}>
                      <SelectTrigger className={cn(touched.genre && errors.genre && 'border-red-500')}>
                        <SelectValue placeholder="Selecione um gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touched.genre && errors.genre && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.genre}
                      </p>
                    )}
                  </div>

                  {/* Media Section */}
                  <div className="border-t pt-5">
                    <label className="text-sm font-medium mb-3 block">Mídia / Link da Música *</label>

                    <div className="flex gap-2 mb-4">
                      <Button type="button" variant={mediaType === 'url' ? 'default' : 'outline'} size="sm" onClick={() => setMediaType('url')}>
                        Link
                      </Button>
                      <Button type="button" variant={mediaType === 'upload' ? 'default' : 'outline'} size="sm" onClick={() => setMediaType('upload')}>
                        Upload
                      </Button>
                    </div>

                    {mediaType === 'url' && (
                      <div>
                        <Input
                          placeholder="Ex: https://open.spotify.com/track/... ou https://youtube.com/watch?v=..."
                          value={mediaUrl}
                          onChange={(e) => handleMediaUrlChange(e.target.value)}
                          onBlur={() => handleFieldBlur('media')}
                          className={cn(touched.media && errors.media && 'border-red-500')}
                        />
                        <p className="text-xs text-muted-foreground mt-2">Suportados: Spotify, YouTube, SoundCloud</p>
                        {mediaUrl && !errors.media && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> URL válida
                          </p>
                        )}
                      </div>
                    )}

                    {mediaType === 'upload' && (
                      <div>
                        <label
                          htmlFor="media-file"
                          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        >
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">
                            {mediaFile ? mediaFile.name : 'Clique ou arraste o arquivo'}
                          </span>
                          <span className="text-xs text-muted-foreground">MP3, WAV, FLAC (máx 50MB)</span>
                        </label>
                        <input id="media-file" type="file" accept=".mp3,.wav,.flac" onChange={handleMediaFileChange} className="hidden" />
                        {mediaFile && (
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{mediaFile.name}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMediaFile(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {touched.media && errors.media && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.media}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Por que você recomenda? *
                      </label>
                      <span className={cn('text-xs', description.length > 450 ? 'text-orange-500' : 'text-muted-foreground')}>
                        {description.length}/500
                      </span>
                    </div>
                    <textarea
                      id="description"
                      placeholder="Compartilhe o que torna essa música especial. Mínimo 50 caracteres."
                      value={description}
                      onChange={(e) => e.target.value.length <= 500 && setDescription(e.target.value)}
                      onBlur={() => handleFieldBlur('description')}
                      rows={5}
                      className={cn(
                        'w-full px-3 py-2 border rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                        touched.description && errors.description ? 'border-red-500 focus:ring-red-500' : 'border-input'
                      )}
                    />
                    {touched.description && errors.description && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Tags (max 5) *</label>
                      {selectedTags.length > 0 && (
                        <span className="text-xs text-green-500 font-medium">{selectedTags.length} selecionada{selectedTags.length > 1 ? 's' : ''}</span>
                      )}
                    </div>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedTags.map((tag) => (
                          <Badge key={tag} variant="default" className="gap-1 pr-1">
                            #{tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Available Tags */}
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          className={cn(
                            'cursor-pointer transition-all',
                            selectedTags.includes(tag) ? '' : 'hover:bg-accent',
                            selectedTags.length >= 5 && !selectedTags.includes(tag) && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => {
                            if (selectedTags.includes(tag)) handleRemoveTag(tag)
                            else if (selectedTags.length < 5) handleAddTag(tag)
                            setTouched({ ...touched, tags: true })
                          }}
                        >
                          {selectedTags.includes(tag) && <Check className="w-3 h-3 mr-1" />}
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {touched.tags && errors.tags && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.tags}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(v) => setAcceptedTerms(v === true)} />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      Entendo que não poderei recomendar essa música novamente nos próximos 30 dias
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading || !isFormValid} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

            {/* Preview & Tips Sidebar */}
            <div className="space-y-4">
              {/* Preview */}
              {(musicTitle || artist) && (
                <Card>
                  <CardHeader className="pb-3">
                    <h3 className="text-sm font-semibold">Preview</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="w-full aspect-square rounded-lg bg-linear-to-br from-primary/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                      {mediaPreview?.includes('embed') ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={mediaPreview}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded"
                          title="Preview"
                        />
                      ) : (
                        <Music className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    {musicTitle && <p className="font-semibold line-clamp-2">{musicTitle}</p>}
                    {artist && <p className="text-sm text-muted-foreground">{artist}</p>}
                    {genre && <Badge variant="secondary">{genre}</Badge>}
                    {description && <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>}
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                        ))}
                        {selectedTags.length > 3 && <Badge variant="outline" className="text-xs">+{selectedTags.length - 3}</Badge>}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sm mb-3">Dicas</h3>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      Descreva emoções e sensações que a música despertou
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      Mencione quando/onde você ouve essa música
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      Tags ajudam outros a encontrarem sua recomendação
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">4.</span>
                      Recomendações detalhadas recebem mais votos
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}