'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Music,
  Mic2,
  Menu,
  Search,
  Bell,
  Settings,
  Loader2,
  Users,
  ThumbsUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SidebarContent } from '@/components/sidebar'
import { getRankings, type RankingUser } from '@/lib/api/recommendations'

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function PositionBadge({ position }: { position: number }) {
  if (position === 1) return <span className="text-xl">🥇</span>
  if (position === 2) return <span className="text-xl">🥈</span>
  if (position === 3) return <span className="text-xl">🥉</span>
  return <span className="text-sm font-bold text-muted-foreground w-6 text-center">{position}</span>
}

function LoadingSkeleton() {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Posicao</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Recomendacoes</TableHead>
            <TableHead className="text-right">Votos</TableHead>
            <TableHead className="text-right">Seguidores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i} className="animate-pulse">
              <TableCell><div className="w-6 h-6 bg-muted rounded" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </TableCell>
              <TableCell><div className="h-4 w-8 bg-muted rounded ml-auto" /></TableCell>
              <TableCell><div className="h-4 w-12 bg-muted rounded ml-auto" /></TableCell>
              <TableCell><div className="h-4 w-10 bg-muted rounded ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

function EmptyState({ type }: { type: 'curators' | 'artists' }) {
  return (
    <Card className="p-8 text-center">
      {type === 'curators' ? (
        <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      ) : (
        <Mic2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      )}
      <h3 className="text-lg font-semibold mb-2">
        Nenhum {type === 'curators' ? 'curador' : 'artista'} no ranking ainda
      </h3>
      <p className="text-muted-foreground mb-4">
        {type === 'curators' 
          ? 'Faca recomendacoes para aparecer no ranking!'
          : 'Artistas com musicas recomendadas aparecerao aqui.'
        }
      </p>
      <Button asChild>
        <Link href="/nova-recomendacao">Criar Recomendacao</Link>
      </Button>
    </Card>
  )
}

function RankingTable({ users, type }: { users: RankingUser[]; type: 'curators' | 'artists' }) {
  if (users.length === 0) {
    return <EmptyState type={type} />
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Posicao</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Recomendacoes</TableHead>
            <TableHead className="text-right">Votos</TableHead>
            <TableHead className="text-right">Seguidores</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell>
                <PositionBadge position={user.position} />
              </TableCell>
              <TableCell>
                <Link href={`/perfil/${user.id}`} className="flex items-center gap-2 hover:underline">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                  {user.isArtist && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Mic2 className="w-3 h-3" />
                    </Badge>
                  )}
                </Link>
              </TableCell>
              <TableCell className="text-right font-medium">{user.stats.recommendations}</TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <ThumbsUp className="w-3 h-3" />
                  {user.stats.totalVotes}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {user.stats.followers}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<'curators' | 'artists'>('curators')
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all')
  const [curators, setCurators] = useState<RankingUser[]>([])
  const [artists, setArtists] = useState<RankingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRankings() {
      setIsLoading(true)
      try {
        const [curatorsRes, artistsRes] = await Promise.all([
          getRankings('curators', period, 20),
          getRankings('artists', period, 20),
        ])
        if (curatorsRes.success) setCurators(curatorsRes.data)
        if (artistsRes.success) setArtists(artistsRes.data)
      } catch (err) {
        console.error('Failed to load rankings:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadRankings()
  }, [period])

  return (
    <div className="min-h-screen bg-background">
        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Rankings</h1>
            </div>
            <p className="text-muted-foreground">Os melhores da comunidade</p>
          </section>

          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Periodo</span>
              <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mes</SelectItem>
                  <SelectItem value="all">Todos os Tempos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="space-y-6">
            <TabsList>
              <TabsTrigger value="curators" className="gap-2">
                <Music className="w-4 h-4" />
                Curadores
              </TabsTrigger>
              <TabsTrigger value="artists" className="gap-2">
                <Mic2 className="w-4 h-4" />
                Artistas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curators">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <RankingTable users={curators} type="curators" />
              )}
            </TabsContent>

            <TabsContent value="artists">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <RankingTable users={artists} type="artists" />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}