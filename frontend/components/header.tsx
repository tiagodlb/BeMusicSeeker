// components/header.tsx
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Menu, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarContent } from '@/components/sidebar'
import { NotificationsPopover } from './notification-popover'

function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md dark:text-muted-foreground">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input 
        type="search" 
        placeholder="Buscar músicas, artistas..." 
        className="pl-9 bg-background/50"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        
        {/* Menu Mobile */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <div className="h-full bg-card">
                 <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex-1">
          <Suspense fallback={<div className="h-10 w-full max-w-md bg-muted rounded animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Ações do Header */}
        <div className="flex items-center gap-2">
          <NotificationsPopover />
        </div>
      </div>
    </header>
  )
}