'use client'

import { useState } from 'react'
import { Menu, Bell, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sidebar, SidebarContent } from '@/components/sidebar'

export default function PerfilPage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
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
            <h1 className="font-bold">Perfil</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold mb-1">Tiago Silva</h1>
              <p className="text-muted-foreground mb-4">@tiagosilva</p>
              <Badge className="mb-4">Curador</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-8">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold">234</p>
                  <p className="text-xs text-muted-foreground">Recomendações</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-xs text-muted-foreground">Seguidores</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold">567</p>
                  <p className="text-xs text-muted-foreground">Seguindo</p>
                </CardContent>
              </Card>
            </div>

            <Button className="w-full mb-8">Seguir</Button>
          </div>
        </main>
      </div>
    </div>
  )
}