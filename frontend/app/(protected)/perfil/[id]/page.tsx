'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  Bell,
  Settings,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Music,
  Users,
  Heart,
  Share2,
  MoreHorizontal,
  ExternalLink,
  Disc3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarContent } from '@/components/sidebar'
import { useAuth } from '@/lib/auth-context'
import { useProfile } from '@/hooks/use-profile'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

function parseSocialLinks(linksString: string | null): Record<string, string> {
  if (!linksString) return {}
  try {
    return JSON.parse(linksString)
  } catch {
    return {}
  }
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
        <div className="mt-6 space-y-4">
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="flex gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
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

export default function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { user: currentUser } = useAuth()
  const { profile, isLoading, error } = useProfile(resolvedParams.id)
  const [activeTab, setActiveTab] = useState('recomendacoes')

  const socialLinks = profile ? parseSocialLinks(profile.social_links) : {}
  const isOwner = currentUser !== null && profile?.id === currentUser.id

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
          <div className="flex h-14 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
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
              <h1 className="font-semibold">Perfil</h1>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/configuracoes">
                  <Settings className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="pb-8">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <ProfileSkeleton />
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/">Voltar ao início</Link>
                </Button>
              </div>
            ) : profile ? (
              <>
                {/* Cover + Avatar Section */}
                <div className="relative">
                  {/* Cover gradient */}
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />

                  {/* Profile info overlay */}
                  <div className="px-4 sm:px-6">
                    <div className="-mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      {/* Avatar + Name */}
                      <div className="flex items-end gap-4">
                        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
                          <AvatarImage src={profile.profile_picture_url ?? undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold">
                            {getInitials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="pb-1 sm:pb-2">
                          <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                              {profile.name}
                            </h1>
                            {profile.is_artist && (
                              <Badge variant="secondary" className="gap-1">
                                <Music className="w-3 h-3" />
                                Artista
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Membro desde {formatDate(profile.created_at)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 sm:pb-2">
                        {isOwner ? (
                          <Button variant="outline" asChild>
                            <Link href="/configuracoes">Editar perfil</Link>
                          </Button>
                        ) : (
                          <>
                            <Button>Seguir</Button>
                            <Button variant="outline" size="icon">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bio + Meta */}
                    <div className="mt-4 space-y-3">
                      {profile.bio && (
                        <p className="text-sm sm:text-base leading-relaxed max-w-xl">
                          {profile.bio}
                        </p>
                      )}

                      {/* Meta info row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {socialLinks.website && (
                          <a
                            href={socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            {socialLinks.website.replace(/https?:\/\//, '')}
                          </a>
                        )}
                        {socialLinks.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {socialLinks.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(profile.created_at)}
                        </span>
                      </div>

                      {/* Social links */}
                      {(socialLinks.spotify || socialLinks.instagram || socialLinks.twitter) && (
                        <div className="flex gap-2">
                          {socialLinks.spotify && (
                            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                              <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
                                <Disc3 className="w-4 h-4 mr-1" />
                                Spotify
                                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                              </a>
                            </Button>
                          )}
                          {socialLinks.instagram && (
                            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                Instagram
                                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mt-6 flex items-center justify-around py-4 border-y bg-muted/30 rounded-lg">
                      <StatItem value={profile.stats.followersCount} label="Seguidores" />
                      <div className="w-px h-8 bg-border" />
                      <StatItem value={profile.stats.followingCount} label="Seguindo" />
                      <div className="w-px h-8 bg-border" />
                      <StatItem value={profile.stats.postsCount} label="Recomendações" />
                      {profile.is_artist && (
                        <>
                          <div className="w-px h-8 bg-border" />
                          <StatItem value={profile.stats.songsCount} label="Músicas" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 px-4 sm:px-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                      <TabsTrigger
                        value="recomendacoes"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3"
                      >
                        Recomendações
                      </TabsTrigger>
                      {profile.is_artist && (
                        <TabsTrigger
                          value="musicas"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3"
                        >
                          Músicas
                        </TabsTrigger>
                      )}
                      <TabsTrigger
                        value="curtidas"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3"
                      >
                        Curtidas
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="recomendacoes" className="mt-6">
                      <EmptyState
                        icon={<Music className="w-8 h-8" />}
                        title="Nenhuma recomendação ainda"
                        description={
                          isOwner
                            ? 'Compartilhe músicas que você ama com a comunidade'
                            : `${profile.name} ainda não fez recomendações`
                        }
                        action={
                          isOwner && (
                            <Button asChild>
                              <Link href="/recomendar">Fazer recomendação</Link>
                            </Button>
                          )
                        }
                      />
                    </TabsContent>

                    <TabsContent value="musicas" className="mt-6">
                      <EmptyState
                        icon={<Disc3 className="w-8 h-8" />}
                        title="Nenhuma música publicada"
                        description={
                          isOwner
                            ? 'Publique suas músicas para que outros possam descobrir'
                            : `${profile.name} ainda não publicou músicas`
                        }
                        action={
                          isOwner && (
                            <Button asChild>
                              <Link href="/publicar">Publicar música</Link>
                            </Button>
                          )
                        }
                      />
                    </TabsContent>

                    <TabsContent value="curtidas" className="mt-6">
                      <EmptyState
                        icon={<Heart className="w-8 h-8" />}
                        title="Nenhuma curtida ainda"
                        description={
                          isOwner
                            ? 'Curta recomendações para salvá-las aqui'
                            : `${profile.name} ainda não curtiu nenhuma recomendação`
                        }
                      />
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

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="py-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 text-muted-foreground">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}