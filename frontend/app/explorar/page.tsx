
// ============================================================
// ARQUIVO 6: frontend/app/explorar/page.tsx
// ============================================================
'use client'

import { useState } from 'react'
import { Menu, Bell, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Sidebar, SidebarContent } from '@/components/sidebar'

const genres = ['Rock', 'Pop', 'Hip-Hop', 'Indie', 'MPB', 'Jazz', 'Eletrônica']

export default function ExplorarPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 border-b bg-background/95 lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-bold">Explorar</h1>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Explorar Gêneros</h1>
            <p className="text-muted-foreground">Descubra recomendações incríveis em seus gêneros favoritos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {genres.map((genre) => (
              <Card key={genre} className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
                <CardContent className="p-8 flex items-center justify-center min-h-32">
                  <div className="text-center">
                    <Compass className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">{genre}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}