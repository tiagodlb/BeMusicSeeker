
// ============================================================
// ARQUIVO 4: frontend/app/seguindo/page.tsx
// ============================================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home, Zap, BarChart3, Compass, Heart, Users, Plus, Menu, Search, Bell, Settings, Music
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Sidebar, SidebarContent } from '@/components/sidebar'

const mockFollowing = [
  { id: '1', name: 'Lucas Oliveira', username: 'lucasoliveira', initials: 'LO', type: 'artista', stats: { followers: 5432, recommendations: 89 } },
  { id: '2', name: 'Beatriz Mendes', username: 'biamendes', initials: 'BM', type: 'curador', stats: { followers: 3210, recommendations: 156 } },
]

export default function SeguindoPage() {
  const [filter, setFilter] = useState('all')

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
                <Input type="search" placeholder="Buscar pessoas..." className="pl-9" />
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
            <h1 className="text-2xl font-bold tracking-tight mb-2">Seguindo</h1>
            <p className="text-muted-foreground">Pessoas que você segue</p>
          </section>

          <div className="flex gap-2 mb-6">
            {['all', 'curators', 'artists'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Todos' : f === 'curators' ? 'Curadores' : 'Artistas'}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFollowing.map((person) => (
              <Card key={person.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{person.initials}</AvatarFallback>
                    </Avatar>
                    <Badge variant="outline" className="text-xs">{person.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <CardTitle className="text-base">{person.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{person.username}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="font-semibold">{person.stats.followers}</p>
                      <p className="text-muted-foreground text-xs">Seguidores</p>
                    </div>
                    <div>
                      <p className="font-semibold">{person.stats.recommendations}</p>
                      <p className="text-muted-foreground text-xs">Recomendações</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-sm">Deixar de Seguir</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}