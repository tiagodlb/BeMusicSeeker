'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Music, X, Loader2, Image as ImageIcon, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
  coverImage: File | null // Novo estado para o arquivo
}

interface FormErrors {
  title?: string
  artist?: string
  genre?: string
  description?: string
  tags?: string
  coverImage?: string
  api?: string
}

export default function NovaRecomendacaoPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    artist: '',
    genre: '',
    description: '',
    tags: [],
    mediaUrl: '',
    coverImage: null
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

  // Lógica de manipulação de imagem
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, coverImage: 'A imagem deve ter no maximo 5MB' }))
        return
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, coverImage: 'O arquivo deve ser uma imagem' }))
        return
      }

      setFormData(prev => ({ ...prev, coverImage: file }))
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setErrors(prev => ({ ...prev, coverImage: undefined }))
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: null }))
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Titulo e obrigatorio'
    if (!formData.artist.trim()) newErrors.artist = 'Artista e obrigatorio'
    if (!formData.genre) newErrors.genre = 'Selecione um genero'
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descricao e obrigatoria'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descricao deve ter pelo menos 10 caracteres'
    }

    if (formData.tags.length === 0) newErrors.tags = 'Selecione pelo menos uma tag'

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
        coverImage: formData.coverImage // Enviando a imagem
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
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Capa (Opcional)</label>
                <div 
                  className={`
                    border-2 border-dashed rounded-lg p-4 transition-colors text-center cursor-pointer
                    ${errors.coverImage ? 'border-destructive bg-destructive/5' : 'border-muted hover:border-primary/50 hover:bg-muted/50'}
                  `}
                  onClick={() => !previewUrl && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />

                  {previewUrl ? (
                    <div className="relative w-40 h-40 mx-auto group">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-md shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeImage()
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="p-3 bg-muted rounded-full">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-primary">Clique para upload</span> ou arraste
                      </div>
                      <p className="text-xs">PNG, JPG ou WEBP (max. 5MB)</p>
                    </div>
                  )}
                </div>
                {errors.coverImage && (
                  <p className="text-destructive text-sm">{errors.coverImage}</p>
                )}
              </div>

              {/* Title & Artist - Mantidos igual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Titulo</label>
                  <Input
                    id="title"
                    placeholder="Ex: Bohemian Rhapsody"
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="artist" className="text-sm font-medium">Artista</label>
                  <Input
                    id="artist"
                    placeholder="Ex: Queen"
                    value={formData.artist}
                    onChange={e => updateField('artist', e.target.value)}
                    className={errors.artist ? 'border-destructive' : ''}
                  />
                  {errors.artist && <p className="text-destructive text-sm">{errors.artist}</p>}
                </div>
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
                {errors.genre && <p className="text-destructive text-sm">{errors.genre}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Por que recomenda?</label>
                <Textarea
                  id="description"
                  placeholder="Conte por que essa musica e especial para voce..."
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  className={`min-h-[120px] ${errors.description ? 'border-destructive' : ''}`}
                  maxLength={500}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (max 5)</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant={formData.tags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer transition-colors hover:bg-primary/20"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {formData.tags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
                {errors.tags && <p className="text-destructive text-sm">{errors.tags}</p>}
              </div>

              {/* Media URL */}
              <div className="space-y-2">
                <label htmlFor="mediaUrl" className="text-sm font-medium">Link (opcional)</label>
                <Input
                  id="mediaUrl"
                  type="url"
                  placeholder="https://open.spotify.com/track/..."
                  value={formData.mediaUrl}
                  onChange={e => updateField('mediaUrl', e.target.value)}
                />
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
                      <Upload className="w-4 h-4 mr-2" />
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
  )
}