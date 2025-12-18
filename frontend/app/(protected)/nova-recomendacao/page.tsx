
// ============================================================
// ARQUIVO 5: frontend/app/nova-recomendacao/page.tsx (SIMPLIFIED FOR LENGTH)
// ============================================================
'use client'

import { useState } from 'react'
import { Menu, Search, Bell, Settings, Plus, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Sidebar, SidebarContent } from '@/components/sidebar'

export default function NovaRecomendacaoPage() {
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

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar..." className="pl-9" />
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

        <main className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-2">Nova Recomendação</h1>
          <p className="text-muted-foreground mb-8">Compartilhe sua descoberta musical</p>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Detalhes da Música</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input placeholder="Nome da música" />
              </div>
              <div>
                <label className="text-sm font-medium">Artista</label>
                <Input placeholder="Nome do artista" />
              </div>
              <Button className="w-full">Publicar</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}