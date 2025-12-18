'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Bell,
    Check,
    MessageCircle,
    ThumbsUp,
    UserPlus,
    Music,
    AtSign,
    Loader2
} from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    Notification
} from '@/lib/api/notifications'
import { useAuth } from '@/lib/auth-context'

function getIcon(type: Notification['type']) {
    switch (type) {
        case 'vote': return <ThumbsUp className="w-4 h-4 text-emerald-500" />
        case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />
        case 'follow': return <UserPlus className="w-4 h-4 text-purple-500" />
        case 'new_song': return <Music className="w-4 h-4 text-orange-500" />
        case 'mention': return <AtSign className="w-4 h-4 text-yellow-500" />
        default: return <Bell className="w-4 h-4" />
    }
}

function getLink(n: Notification) {
    if (n.type === 'follow' && n.related_id) return `/perfil/${n.related_id}`
    if (n.related_type === 'user' && n.related_id) return `/perfil/${n.related_id}`
    if (n.related_type === 'post') return `/post/${n.related_id}`
    if (n.related_type === 'song') return `/musica/${n.related_id}`
    return '#'
}


function formatTime(dateString: string) {
    // Parse da data vinda do banco (assume UTC)
    const date = new Date(dateString)
    const now = new Date()

    // Calcular diferença em milissegundos
    const diff = now.getTime() - date.getTime()

    // Se a diferença for negativa (data futura), mostrar "Agora"
    if (diff < 0) return 'Agora'

    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`

    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`

    // Para notificações mais antigas, mostrar data formatada
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function NotificationsPopover() {
    const { isAuthenticated } = useAuth()
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    // Função para carregar notificações (SEM useEffect dentro!)
    const loadNotifications = async () => {
        if (!isAuthenticated) return
        setIsLoading(true)
        try {
            const res = await getNotifications()
            if (res.success && res.data) {
                setNotifications(res.data.notifications)
                setUnreadCount(res.data.unreadCount)
            }
        } catch (err) {
            console.log("Erro ao carregar notificações", err)
        } finally {
            setIsLoading(false)
        }
    }

    // Carrega contagem inicial quando autenticado
    useEffect(() => {
        if (isAuthenticated) {
            getNotifications()
                .then(res => {
                    if (res.success && res.data) {
                        setUnreadCount(res.data.unreadCount)
                    }
                })
                .catch(err => console.log("Notificações silenciosas falharam", err))
        }
    }, [isAuthenticated])

    // Carrega lista completa ao abrir o popover
    useEffect(() => {
        if (open && isAuthenticated) {
            loadNotifications()
        }
    }, [open, isAuthenticated])

    const handleMarkRead = async (id: number) => {
        // Atualização otimista
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
        await markAsRead(id)
    }

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)
        await markAllAsRead()
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse" />
                    )}
                    <span className="sr-only">Notificações</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h4 className="font-semibold text-sm">Notificações</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto text-xs px-2 py-1"
                            onClick={handleMarkAllRead}
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Marcar lidas
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-20">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                            <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">Você não tem novas notificações.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex gap-3 p-4 hover:bg-muted/50 transition-colors relative group",
                                        !notification.is_read && "bg-muted/20"
                                    )}
                                >
                                    <div className="mt-1 shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Link
                                            href={getLink(notification)}
                                            onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                                            className="block text-sm text-foreground hover:underline"
                                        >
                                            {notification.content}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">
                                            {formatTime(notification.created_at)}
                                        </p>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => handleMarkRead(notification.id)}
                                                title="Marcar como lida"
                                            >
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                            </Button>
                                        </div>
                                    )}
                                    {!notification.is_read && (
                                        <div className="absolute right-4 top-4 w-2 h-2 bg-primary rounded-full group-hover:opacity-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}