'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  Zap,
  BarChart3,
  Compass,
  Heart,
  Users,
  Plus,
  ChevronDown,
  Menu,
  Search,
  Bell,
  Settings,
  Music,
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Palette,
  Trash2,
  LogOut,
  Camera,
  Check,
  AlertTriangle,
  Loader2,
  Globe,
  Mail,
  Volume2,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/trending', label: 'Em Alta', icon: Zap },
  { href: '/rankings', label: 'Rankings', icon: BarChart3 },
  { href: '/explorar', label: 'Explorar Gêneros', icon: Compass },
]

const libraryItems = [
  { href: '/favoritos', label: 'Meus Favoritos', icon: Heart },
  { href: '/seguindo', label: 'Seguindo', icon: Users },
]

function SidebarContent() {
  return (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-purple-600 flex items-center justify-center">
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">BeMusicShare</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Menu</p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Biblioteca</p>
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4">
        <Button asChild className="w-full">
          <Link href="/nova-recomendacao">
            <Plus className="w-4 h-4 mr-2" />
            Criar Recomendação
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm">TS</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Tiago Silva</p>
                <p className="text-xs text-muted-foreground">Curador</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild><Link href="/perfil/tiagosilva">Meu Perfil</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/configuracoes">Configurações</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}

export default function ConfiguracoesPage() {
  const router = useRouter()

  // Profile state
  const [name, setName] = useState('Tiago Silva')
  const [username, setUsername] = useState('tiagosilva')
  const [email, setEmail] = useState('tiago@email.com')
  const [bio, setBio] = useState('Apaixonado por música indie e MPB.')
  const [location, setLocation] = useState('São Paulo, SP')
  const [website, setWebsite] = useState('')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [newFollowerNotif, setNewFollowerNotif] = useState(true)
  const [newCommentNotif, setNewCommentNotif] = useState(true)
  const [newVoteNotif, setNewVoteNotif] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  // Privacy state
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'followers' | 'private'>('public')
  const [showActivity, setShowActivity] = useState(true)
  const [allowMessages, setAllowMessages] = useState(true)
  const [showInRankings, setShowInRankings] = useState(true)

  // Appearance state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [language, setLanguage] = useState('pt-BR')
  const [autoplay, setAutoplay] = useState(true)

  // Loading states
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSavingProfile(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return
    setIsSavingPassword(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSavingPassword(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    await new Promise((r) => setTimeout(r, 1500))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl">
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
            </div>
            <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
          </section>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4 hidden sm:block" />Perfil</TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4 hidden sm:block" />Notificações</TabsTrigger>
              <TabsTrigger value="privacy" className="gap-2"><Shield className="w-4 h-4 hidden sm:block" />Privacidade</TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4 hidden sm:block" />Aparência</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Atualize suas informações públicas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white text-2xl">TS</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm"><Camera className="w-4 h-4 mr-2" />Alterar foto</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou GIF. Máx 2MB.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-8" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 150))}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary border-input"
                      placeholder="Conte um pouco sobre você..."
                    />
                    <p className="text-xs text-muted-foreground text-right">{bio.length}/150</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Localização</Label>
                      <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade, Estado" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="seusite.com" />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                    {isSavingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</> : <><Check className="w-4 h-4 mr-2" />Salvar alterações</>}
                  </Button>
                </CardContent>
              </Card>

              {/* Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>Atualize sua senha de acesso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-destructive">As senhas não coincidem</p>
                  )}

                  <Button
                    onClick={handleChangePassword}
                    disabled={isSavingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                  >
                    {isSavingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Alterando...</> : <><Lock className="w-4 h-4 mr-2" />Alterar senha</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Canais de Notificação</CardTitle>
                  <CardDescription>Escolha como deseja receber notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por email</Label>
                      <p className="text-sm text-muted-foreground">Receba atualizações no seu email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações push</Label>
                      <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Notificação</CardTitle>
                  <CardDescription>Selecione o que deseja ser notificado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Novos seguidores</Label>
                      <p className="text-sm text-muted-foreground">Quando alguém começar a te seguir</p>
                    </div>
                    <Switch checked={newFollowerNotif} onCheckedChange={setNewFollowerNotif} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Comentários</Label>
                      <p className="text-sm text-muted-foreground">Quando comentarem suas recomendações</p>
                    </div>
                    <Switch checked={newCommentNotif} onCheckedChange={setNewCommentNotif} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Votos</Label>
                      <p className="text-sm text-muted-foreground">Quando votarem em suas recomendações</p>
                    </div>
                    <Switch checked={newVoteNotif} onCheckedChange={setNewVoteNotif} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Resumo semanal</Label>
                      <p className="text-sm text-muted-foreground">Receba um resumo das atividades</p>
                    </div>
                    <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visibilidade do Perfil</CardTitle>
                  <CardDescription>Controle quem pode ver seu perfil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quem pode ver seu perfil</Label>
                    <Select value={profileVisibility} onValueChange={(v: 'public' | 'followers' | 'private') => setProfileVisibility(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Todos (público)</SelectItem>
                        <SelectItem value="followers">Apenas seguidores</SelectItem>
                        <SelectItem value="private">Apenas eu (privado)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade e Interações</CardTitle>
                  <CardDescription>Controle como outros interagem com você</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mostrar atividade</Label>
                      <p className="text-sm text-muted-foreground">Exibir suas atividades recentes</p>
                    </div>
                    <Switch checked={showActivity} onCheckedChange={setShowActivity} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Permitir mensagens</Label>
                      <p className="text-sm text-muted-foreground">Receber mensagens de outros usuários</p>
                    </div>
                    <Switch checked={allowMessages} onCheckedChange={setAllowMessages} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Aparecer em rankings</Label>
                      <p className="text-sm text-muted-foreground">Ser listado nos rankings públicos</p>
                    </div>
                    <Switch checked={showInRankings} onCheckedChange={setShowInRankings} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tema</CardTitle>
                  <CardDescription>Personalize a aparência da plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Claro', icon: Sun },
                      { value: 'dark', label: 'Escuro', icon: Moon },
                      { value: 'system', label: 'Sistema', icon: Monitor },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as typeof theme)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                          theme === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        )}
                      >
                        <option.icon className={cn('w-6 h-6', theme === option.value ? 'text-primary' : 'text-muted-foreground')} />
                        <span className={cn('text-sm font-medium', theme === option.value ? 'text-primary' : '')}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferências</CardTitle>
                  <CardDescription>Outras configurações de exibição</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autoplay</Label>
                      <p className="text-sm text-muted-foreground">Reproduzir músicas automaticamente</p>
                    </div>
                    <Switch checked={autoplay} onCheckedChange={setAutoplay} />
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                  <CardDescription>Ações irreversíveis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sair da conta</Label>
                      <p className="text-sm text-muted-foreground">Encerrar sua sessão atual</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/entrar')}>
                      <LogOut className="w-4 h-4 mr-2" />Sair
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-destructive">Excluir conta</Label>
                      <p className="text-sm text-muted-foreground">Remover permanentemente sua conta e dados</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Excluir</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            Excluir conta permanentemente?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Todos os seus dados, recomendações, comentários e conexões serão permanentemente removidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sim, excluir minha conta'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}