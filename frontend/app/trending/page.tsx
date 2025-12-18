
// ============================================================
// ARQUIVO 2: frontend/app/trending/page.tsx
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home, Zap, BarChart3, Compass, Heart, Users, Plus, Flame, Music, Menu, Search, Bell, Settings, MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sidebar, SidebarContent } from '@/components/sidebar'

const mockTrendingMusic = [
  { id: '1', position: 1, title: 'Neon Dreams', artist: 'Midnight Runners', genre: 'Synthwave', stats: { upvotes: 342, comments: 28, plays: 1247 }, curator: 'Mariana Lima' },
  { id: '2', position: 2, title: 'Céu de Santo Amaro', artist: 'Flávio Venturini', genre: 'MPB', stats: { upvotes: 256, comments: 45, plays: 892 }, curator: 'Rafael Costa' },
  { id: '3', position: 3, title: 'Electric Feel', artist: 'MGMT', genre: 'Indie', stats: { upvotes: 189, comments: 67, plays: 2341 }, curator: 'Julia Ferreira' },
  { id: '4', position: 4, title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Pop', stats: { upvotes: 178, comments: 34, plays: 3456 }, curator: 'Carlos Silva' },
]

export default function TrendingPage() {
  const [period, setPeriod] = useState('today')
  const [genre, setGenre] = useState('all')

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
                <Input type="search" placeholder="Buscar músicas..." className="pl-9" />
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
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Em Alta</h1>
            </div>
            <p className="text-muted-foreground">Músicas trending da comunidade agora</p>
          </section>

          <section className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Período</span>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase">Gênero</span>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="indie">Indie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Música</TableHead>
                  <TableHead>Artista</TableHead>
                  <TableHead className="text-right">Upvotes</TableHead>
                  <TableHead className="text-right">Comentários</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrendingMusic.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">{item.position}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.artist}</TableCell>
                    <TableCell className="text-right">{item.stats.upvotes}</TableCell>
                    <TableCell className="text-right">{item.stats.comments}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Adicionar aos favoritos</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </div>
  )
}