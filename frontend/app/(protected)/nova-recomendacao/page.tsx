'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, Search, Bell, Settings, Plus, Music, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { SidebarContent } from '@/components/sidebar'
import { createRecommendation } from '@/lib/api/recommendations'

const GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Eletronica', 'Jazz', 
  'Blues', 'Country', 'Reggae', 'MPB', 'Sertanejo', 'Funk',
  'Indie', 'Metal', 'Classica', 'Folk', 'Soul', 'Outro'
]

const AVAILABLE_TAGS = [
  'Relaxante', 'Animado', 'Melancolico', 'Romantico', 'Festa',
  'Treino', 'Foco', 'Acustico', 'Instrumental', 'Vocal',
  'Descoberta', 'Classico', 'Underground', 'Mainstream', 'Brasileiro'
]

interface FormData {
  title: string
  artist: string
  genre: string
  description: string
  tags: string[]
  mediaUrl: string
}

interface FormErrors {
  title?: string
  artist?: string
  genre?: string
  description?: string
  tags?: string
  api?: string
}

export default function NovaRecomendacaoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    title: '',
    artist: '',
    genre: '',
    description: '',
    tags: [],
    mediaUrl: '',
  })

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : prev.tags.length < 5
          ? [...prev.tags, tag]
          : prev.tags
    }))
    if (errors.tags) {
      setErrors(prev => ({ ...prev, tags: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Titulo e obrigatorio'
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artista e obrigatorio'
    }

    if (!formData.genre) {
      newErrors.genre = 'Selecione um genero'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descricao e obrigatoria'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descricao deve ter pelo menos 10 caracteres'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Descricao deve ter no maximo 500 caracteres'
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'Selecione pelo menos uma tag'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const result = await createRecommendation({
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        genre: formData.genre,
        description: formData.description.trim(),
        tags: formData.tags,
        mediaUrl: formData.mediaUrl.trim() || undefined,
      })

      if (result.success) {
        router.push('/dashboard')
      }
    } catch (err) {
      setErrors({
        api: err instanceof Error ? err.message : 'Erro ao criar recomendacao'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
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
                <Input type="search" placeholder="Buscar..." className="pl-9" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Nova Recomendacao</h1>
            <p className="text-muted-foreground">Compartilhe sua descoberta musical com a comunidade</p>
          </div>

          {errors.api && (
            <Card className="mb-6 border-destructive bg-destructive/10">
              <CardContent className="py-4">
                <p className="text-destructive text-sm">{errors.api}</p>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Detalhes da Musica</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Titulo da Musica
                  </label>
                  <Input
                    id="title"
                    placeholder="Ex: Bohemian Rhapsody"
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm">{errors.title}</p>
                  )}
                </div>

                {/* Artist */}
                <div className="space-y-2">
                  <label htmlFor="artist" className="text-sm font-medium">
                    Artista
                  </label>
                  <Input
                    id="artist"
                    placeholder="Ex: Queen"
                    value={formData.artist}
                    onChange={e => updateField('artist', e.target.value)}
                    className={errors.artist ? 'border-destructive' : ''}
                  />
                  {errors.artist && (
                    <p className="text-destructive text-sm">{errors.artist}</p>
                  )}
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genero</label>
                  <Select
                    value={formData.genre}
                    onValueChange={value => updateField('genre', value)}
                  >
                    <SelectTrigger className={errors.genre ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione um genero" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENRES.map(genre => (
                        <SelectItem key={genre} value={genre.toLowerCase()}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.genre && (
                    <p className="text-destructive text-sm">{errors.genre}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Por que voce recomenda?
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Conte por que essa musica e especial para voce..."
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    className={`min-h-[120px] ${errors.description ? 'border-destructive' : ''}`}
                    maxLength={500}
                  />
                  <div className="flex justify-between text-sm">
                    {errors.description ? (
                      <p className="text-destructive">{errors.description}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-muted-foreground">
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tags (max 5)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => (
                      <Badge
                        key={tag}
                        variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {formData.tags.includes(tag) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {errors.tags && (
                    <p className="text-destructive text-sm">{errors.tags}</p>
                  )}
                </div>

                {/* Media URL (optional) */}
                <div className="space-y-2">
                  <label htmlFor="mediaUrl" className="text-sm font-medium">
                    Link (opcional)
                  </label>
                  <Input
                    id="mediaUrl"
                    type="url"
                    placeholder="https://open.spotify.com/track/..."
                    value={formData.mediaUrl}
                    onChange={e => updateField('mediaUrl', e.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">
                    Spotify, YouTube, SoundCloud, etc.
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Publicar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </div>
  )
}