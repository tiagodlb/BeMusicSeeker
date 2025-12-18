'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu,
  Bell,
  Settings,
  Link as LinkIcon,
  Music,
  Heart,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Play,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarContent } from '@/components/sidebar'
import { useAuth } from '@/lib/auth-context'
import { useProfile } from '@/hooks/use-profile'
import { getRecommendations, voteRecommendation, type Recommendation } from '@/lib/api/recommendations'
import { cn } from '@/lib/utils'

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Agora'
  if (diffMins < 60) return `${diffMins} min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR')
}

function parseSocialLinks(linksString: string | null): Record<string, string> {
  if (!linksString) return {}
  try { return JSON.parse(linksString) } catch { return {} }
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-muted rounded-t-xl" />
      <div className="px-6 pb-6">
        <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-background" />
            <div className="space-y-2 pb-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function RecommendationCard({ rec, onVote }: { rec: Recommendation; onVote: (id: number, type: 'up' | 'down') => void }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
              {rec.music.coverUrl ? (
                <img src={rec.music.coverUrl} alt={rec.music.title} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Music className="w-6 h-6 text-primary/60" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{rec.music.title}</h3>
              <p className="text-sm text-muted-foreground">{rec.music.artist}</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(rec.createdAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{rec.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {rec.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-2">
        <div className="flex items-center gap-2 w-full">
          <Button variant="ghost" size="sm" className={cn('gap-1.5 h-8', rec.userVote === 'up' && 'text-emerald-500')} onClick={() => onVote(rec.id, 'up')}>
            <ThumbsUp className="w-3.5 h-3.5" />{rec.stats.upvotes}
          </Button>
          <Button variant="ghost" size="sm" className={cn('gap-1.5 h-8', rec.userVote === 'down' && 'text-red-500')} onClick={() => onVote(rec.id, 'down')}>
            <ThumbsDown className="w-3.5 h-3.5" />{rec.stats.downvotes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 h-8">
            <MessageCircle className="w-3.5 h-3.5" />{rec.stats.comments}
          </Button>
          <div className="flex-1" />
          {rec.music.link && (
            <Button variant="ghost" size="sm" className="h-8" asChild>
              <a href={rec.music.link} target="_blank" rel="noopener noreferrer">
                <Play className="w-3.5 h-3.5 mr-1" />Ouvir
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ icon, title, description, action }: { icon: React.ReactNode; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 text-muted-foreground">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user: currentUser } = useAuth()
  const { profile, isLoading, error } = useProfile(resolvedParams.id)
  const [activeTab, setActiveTab] = useState('recomendacoes')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loadingRecs, setLoadingRecs] = useState(true)

  const socialLinks = profile ? parseSocialLinks(profile.social_links) : {}
  const isOwner = currentUser !== null && profile?.id === currentUser.id

  useEffect(() => {
    async function loadRecs() {
      if (!profile?.id) return
      setLoadingRecs(true)
      try {
        const response = await getRecommendations(20, 0, profile.id)
        if (response.success) setRecommendations(response.data)
      } catch (err) {
        console.error('Failed to load recommendations:', err)
      } finally {
        setLoadingRecs(false)
      }
    }
    loadRecs()
  }, [profile?.id])

  const handleVote = async (id: number, voteType: 'up' | 'down') => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id !== id) return rec
      const currentVote = rec.userVote
      let newVote: 'up' | 'down' | null = voteType
      let upvoteDelta = 0, downvoteDelta = 0
      if (currentVote === voteType) {
        newVote = null
        if (voteType === 'up') upvoteDelta = -1; else downvoteDelta = -1
      } else {
        if (currentVote === 'up') upvoteDelta = -1
        else if (currentVote === 'down') downvoteDelta = -1
        if (voteType === 'up') upvoteDelta += 1; else downvoteDelta += 1
      }
      return { ...rec, userVote: newVote, stats: { ...rec.stats, upvotes: rec.stats.upvotes + upvoteDelta, downvotes: rec.stats.downvotes + downvoteDelta } }
    }))
    try { await voteRecommendation(id, voteType === 'up' ? 'upvote' : 'downvote') } catch (err) { console.error('Vote failed:', err) }
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card"><SidebarContent /></aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="w-5 h-5" /></Button></SheetTrigger>
                <SheetContent side="left" className="w-64 p-0"><SidebarContent /></SheetContent>
              </Sheet>
              <h1 className="font-semibold">Perfil</h1>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" asChild><Link href="/configuracoes"><Settings className="w-5 h-5" /></Link></Button>
            </div>
          </div>
        </header>

        <main className="pb-8">
          <div className="max-w-3xl mx-auto">
            {isLoading ? <ProfileSkeleton /> : error ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" asChild><Link href="/">Voltar</Link></Button>
              </div>
            ) : profile ? (
              <>
                <div className="relative">
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
                  <div className="px-4 sm:px-6">
                    <div className="-mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div className="flex items-end gap-4">
                        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
                          <AvatarImage src={profile.profile_picture_url ?? undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold">{getInitials(profile.name)}</AvatarFallback>
                        </Avatar>
                        <div className="pb-1 sm:pb-2">
                          <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{profile.name}</h1>
                            {profile.is_artist && <Badge variant="secondary" className="gap-1"><Music className="w-3 h-3" />Artista</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">Membro desde {formatDate(profile.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:pb-2">
                        {isOwner ? (
                          <Button variant="outline" asChild><Link href="/configuracoes">Editar perfil</Link></Button>
                        ) : (
                          <><Button>Seguir</Button><Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button></>
                        )}
                      </div>
                    </div>
                    {profile.bio && <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl">{profile.bio}</p>}
                    {socialLinks.website && (
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <LinkIcon className="w-4 h-4" />{socialLinks.website.replace(/https?:\/\//, '').replace(/\/$/, '')}
                      </a>
                    )}
                    <div className="mt-6 flex items-center justify-around py-4 border-y bg-muted/30 rounded-lg">
                      <StatItem value={profile.stats.followersCount} label="Seguidores" />
                      <div className="w-px h-8 bg-border" />
                      <StatItem value={profile.stats.followingCount} label="Seguindo" />
                      <div className="w-px h-8 bg-border" />
                      <StatItem value={profile.stats.postsCount} label="Recomendacoes" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 px-4 sm:px-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                      <TabsTrigger value="recomendacoes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3">Recomendacoes</TabsTrigger>
                      <TabsTrigger value="curtidas" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3">Curtidas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="recomendacoes" className="mt-6">
                      {loadingRecs ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                      ) : recommendations.length === 0 ? (
                        <EmptyState
                          icon={<Music className="w-8 h-8" />}
                          title="Nenhuma recomendacao ainda"
                          description={isOwner ? 'Compartilhe musicas que voce ama com a comunidade' : `${profile.name} ainda nao fez recomendacoes`}
                          action={isOwner && <Button asChild><Link href="/nova-recomendacao">Fazer recomendacao</Link></Button>}
                        />
                      ) : (
                        <div className="space-y-4">
                          {recommendations.map((rec) => <RecommendationCard key={rec.id} rec={rec} onVote={handleVote} />)}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="curtidas" className="mt-6">
                      <EmptyState icon={<Heart className="w-8 h-8" />} title="Nenhuma curtida ainda" description={isOwner ? 'Curta recomendacoes para salva-las aqui' : `${profile.name} ainda nao curtiu nenhuma recomendacao`} />
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}