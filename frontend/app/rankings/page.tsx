// ============================================================
// ARQUIVO 1: frontend/app/rankings/page.tsx
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Home, Zap, BarChart3, Compass, Heart, Users, Plus, Trophy, Music, Menu, Search, Bell, Settings, Mic2, MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sidebar, SidebarContent } from '@/components/sidebar'

const mockRankingData = [
  { id: '1', position: 1, name: 'Tiago Silva', initials: 'TS', stats: { recommendations: 234, totalVotes: 5621, followers: 1234 } },
  { id: '2', position: 2, name: 'Maria Lima', initials: 'ML', stats: { recommendations: 189, totalVotes: 4523, followers: 987 } },
  { id: '3', position: 3, name: 'Rafael Costa', initials: 'RC', stats: { recommendations: 156, totalVotes: 3876, followers: 876 } },
  { id: '4', position: 4, name: 'Ana Paula', initials: 'AP', stats: { recommendations: 132, totalVotes: 3234, followers: 765 } },
  { id: '5', position: 5, name: 'Carlos Silva', initials: 'CS', stats: { recommendations: 98, totalVotes: 2876, followers: 654 } },
  { id: '6', position: 6, name: 'Julia Ferreira', initials: 'JF', stats: { recommendations: 65, totalVotes: 2187, followers: 987 } },
  { id: '7', position: 7, name: 'Beatriz Santos', initials: 'BS', stats: { recommendations: 54, totalVotes: 1876, followers: 876 } },
  { id: '8', position: 8, name: 'Lucas Oliveira', initials: 'LO', stats: { recommendations: 48, totalVotes: 1654, followers: 765 } },
]

function PositionBadge({ position }: { position: number }) {
  if (position === 1) return <div className="text-lg">🥇</div>
  if (position === 2) return <div className="text-lg">🥈</div>
  if (position === 3) return <div className="text-lg">🥉</div>
  return <span className="text-sm font-medium text-muted-foreground">{position}</span>
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState('curators')

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
                <Input type="search" placeholder="Buscar curadores..." className="pl-9" />
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
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Rankings</h1>
            </div>
            <p className="text-muted-foreground">Os melhores da comunidade</p>
          </section>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

            <TabsContent value="curators" className="space-y-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Posição</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Recomendações</TableHead>
                      <TableHead className="text-right">Votos</TableHead>
                      <TableHead className="text-right">Seguidores</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRankingData.map((curator) => (
                      <TableRow key={curator.id}>
                        <TableCell><PositionBadge position={curator.position} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{curator.initials}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{curator.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{curator.stats.recommendations}</TableCell>
                        <TableCell className="text-right">{curator.stats.totalVotes}</TableCell>
                        <TableCell className="text-right">{curator.stats.followers}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                              <DropdownMenuItem>Seguir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}