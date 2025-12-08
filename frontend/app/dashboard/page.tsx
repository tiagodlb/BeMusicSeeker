'use client'

import { useState } from 'react'
import styles from './dashboard.module.css'

interface RecommendationCard {
  id: string
  user: {
    name: string
    initials: string
    profileUrl: string
  }
  timestamp: string
  music: {
    title: string
    artist: string
    coverUrl?: string
    duration: string
  }
  description: string
  tags: string[]
  stats: {
    upvotes: number
    downvotes: number
    comments: number
  }
  userVote?: 'up' | 'down' | null
}

const mockRecommendations: RecommendationCard[] = [
  {
    id: '1',
    user: {
      name: 'Mariana Lima',
      initials: 'ML',
      profileUrl: '/perfil/mariana-lima'
    },
    timestamp: '2 horas atrás',
    music: {
      title: 'Neon Dreams',
      artist: 'Midnight Runners',
      duration: '4:02'
    },
    description: 'Uma das melhores descobertas do ano para mim. O synth retro combinado com vocais modernos cria uma atmosfera única. Perfeita para ouvir enquanto trabalha ou estuda.',
    tags: ['synthwave', 'retro', 'para-estudar'],
    stats: { upvotes: 342, downvotes: 12, comments: 28 },
    userVote: 'up'
  },
  {
    id: '2',
    user: {
      name: 'Rafael Costa',
      initials: 'RC',
      profileUrl: '/perfil/rafael-costa'
    },
    timestamp: '4 horas atrás',
    music: {
      title: 'Céu de Santo Amaro',
      artist: 'Flávio Venturini',
      duration: '5:18'
    },
    description: 'Clássico atemporal da MPB que sempre me emociona. A poesia das letras combinada com a melodia suave faz dessa música uma obra-prima brasileira que todos deveriam conhecer.',
    tags: ['mpb', 'clássico', 'brasileiro'],
    stats: { upvotes: 256, downvotes: 8, comments: 45 },
    userVote: null
  },
  {
    id: '3',
    user: {
      name: 'Julia Ferreira',
      initials: 'JF',
      profileUrl: '/perfil/julia-ferreira'
    },
    timestamp: 'Ontem',
    music: {
      title: 'Electric Feel',
      artist: 'MGMT',
      duration: '3:49'
    },
    description: 'Impossível ouvir essa música e não se sentir em uma festa de verão. O groove é contagiante e a produção é impecável. Um hit indie que merece ser redescoberto por uma nova geração.',
    tags: ['indie', 'electropop', 'verão', 'festa'],
    stats: { upvotes: 189, downvotes: 5, comments: 67 },
    userVote: null
  }
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [filters, setFilters] = useState({
    period: 'week',
    genre: 'all',
    sort: 'votes'
  })
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleVote = (id: string, voteType: 'up' | 'down') => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id !== id) return rec
      
      const currentVote = rec.userVote
      let newVote: 'up' | 'down' | null = voteType
      let upvoteDelta = 0
      let downvoteDelta = 0

      if (currentVote === voteType) {
        newVote = null
        if (voteType === 'up') upvoteDelta = -1
        else downvoteDelta = -1
      } else {
        if (currentVote === 'up') upvoteDelta = -1
        else if (currentVote === 'down') downvoteDelta = -1
        
        if (voteType === 'up') upvoteDelta += 1
        else downvoteDelta += 1
      }

      return {
        ...rec,
        userVote: newVote,
        stats: {
          ...rec.stats,
          upvotes: rec.stats.upvotes + upvoteDelta,
          downvotes: rec.stats.downvotes + downvoteDelta
        }
      }
    }))
  }

  return (
    <div className={styles.layout}>
      {/* Overlay mobile */}
      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.visible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <MusicIcon />
            </div>
            <span className={styles.logoText}>BeMusicShare</span>
          </a>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h2 className={styles.navSectionTitle}>Menu</h2>
            <ul className={styles.navList}>
              <li>
                <a href="/dashboard" className={`${styles.navLink} ${styles.active}`}>
                  <HomeIcon />
                  <span>Início</span>
                </a>
              </li>
              <li>
                <a href="/trending" className={styles.navLink}>
                  <TrendingIcon />
                  <span>Em Alta</span>
                </a>
              </li>
              <li>
                <a href="/rankings" className={styles.navLink}>
                  <RankingIcon />
                  <span>Rankings</span>
                </a>
              </li>
              <li>
                <a href="/explorar" className={styles.navLink}>
                  <ExploreIcon />
                  <span>Explorar Gêneros</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <h2 className={styles.navSectionTitle}>Biblioteca</h2>
            <ul className={styles.navList}>
              <li>
                <a href="/favoritos" className={styles.navLink}>
                  <HeartIcon />
                  <span>Meus Favoritos</span>
                </a>
              </li>
              <li>
                <a href="/seguindo" className={styles.navLink}>
                  <UsersIcon />
                  <span>Seguindo</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.sidebarCta}>
          <a href="/nova-recomendacao" className={styles.btnPrimary}>
            <PlusIcon />
            Criar Recomendação
          </a>
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.userMenu}>
            <div className={styles.userAvatar}>TS</div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Tiago Silva</div>
              <div className={styles.userRole}>Curador</div>
            </div>
            <ChevronDownIcon />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <button 
            className={styles.mobileMenuToggle}
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </button>

          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <SearchIcon className={styles.searchIcon} />
              <input 
                type="search"
                className={styles.searchInput}
                placeholder="Buscar músicas, artistas, pessoas..."
              />
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.headerBtn} aria-label="Notificações">
              <BellIcon />
              <span className={styles.notificationBadge} />
            </button>
            <button className={styles.headerBtn} aria-label="Configurações">
              <SettingsIcon />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {/* Welcome */}
          <section className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              Bem-vindo de volta, <span className={styles.highlight}>Tiago</span>
            </h1>
            <p className={styles.welcomeSubtitle}>
              Você tem <span className={styles.highlight}>3 notificações</span> não lidas
            </p>
          </section>

          {/* Filters */}
          <section className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <label htmlFor="filter-period" className={styles.filterLabel}>Período</label>
              <select 
                id="filter-period"
                className={styles.filterSelect}
                value={filters.period}
                onChange={(e) => setFilters(f => ({ ...f, period: e.target.value }))}
              >
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="all">Todos os Tempos</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="filter-genre" className={styles.filterLabel}>Gênero</label>
              <select 
                id="filter-genre"
                className={styles.filterSelect}
                value={filters.genre}
                onChange={(e) => setFilters(f => ({ ...f, genre: e.target.value }))}
              >
                <option value="all">Todos</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="electronic">Eletrônica</option>
                <option value="jazz">Jazz</option>
                <option value="mpb">MPB</option>
                <option value="indie">Indie</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="filter-sort" className={styles.filterLabel}>Ordenar</label>
              <select 
                id="filter-sort"
                className={styles.filterSelect}
                value={filters.sort}
                onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
              >
                <option value="votes">Mais Votados</option>
                <option value="recent">Mais Recentes</option>
                <option value="trending">Trending</option>
                <option value="following">Meus Seguidos</option>
              </select>
            </div>

            <div className={styles.filtersSpacer} />

            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
              >
                <ListIcon />
              </button>
              <button 
                className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
              >
                <GridIcon />
              </button>
            </div>
          </section>

          {/* Feed */}
          <section className={styles.feed}>
            {recommendations.map(rec => (
              <RecommendationCardComponent 
                key={rec.id} 
                data={rec} 
                onVote={handleVote}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}

// Recommendation Card Component
function RecommendationCardComponent({ 
  data, 
  onVote 
}: { 
  data: RecommendationCard
  onVote: (id: string, type: 'up' | 'down') => void 
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardAvatar}>{data.user.initials}</div>
        <div className={styles.cardUserInfo}>
          <a href={data.user.profileUrl} className={styles.cardUserName}>
            {data.user.name}
          </a>
          <span className={styles.cardTimestamp}>{data.timestamp}</span>
        </div>
        <button className={styles.cardMenuBtn} aria-label="Mais opções">
          <MoreIcon />
        </button>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardMusicInfo}>
          <div className={styles.cardCover}>
            <div className={styles.cardCoverPlaceholder}>
              <MusicIcon />
            </div>
          </div>
          <div className={styles.cardMusicDetails}>
            <h2 className={styles.cardMusicTitle}>{data.music.title}</h2>
            <p className={styles.cardMusicArtist}>{data.music.artist}</p>
            <p className={styles.cardDescription}>{data.description}</p>
          </div>
        </div>

        <div className={styles.cardTags}>
          {data.tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>

        {/* Mini Player */}
        <div className={styles.miniPlayer}>
          <button 
            className={styles.playerBtn}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div className={styles.playerProgress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.progressTimes}>
              <span>0:00</span>
              <span>{data.music.duration}</span>
            </div>
          </div>
          <div className={styles.playerVolume}>
            <button className={styles.volumeBtn} aria-label="Volume">
              <VolumeIcon />
            </button>
            <input 
              type="range" 
              className={styles.volumeSlider}
              min="0" 
              max="100" 
              defaultValue="75"
            />
          </div>
        </div>
      </div>

      <footer className={styles.cardFooter}>
        <button 
          className={`${styles.actionBtn} ${styles.upvote} ${data.userVote === 'up' ? styles.active : ''}`}
          onClick={() => onVote(data.id, 'up')}
          aria-pressed={data.userVote === 'up'}
        >
          <ThumbUpIcon />
          {data.stats.upvotes}
        </button>
        <button 
          className={`${styles.actionBtn} ${styles.downvote} ${data.userVote === 'down' ? styles.active : ''}`}
          onClick={() => onVote(data.id, 'down')}
          aria-pressed={data.userVote === 'down'}
        >
          <ThumbDownIcon />
          {data.stats.downvotes}
        </button>
        <button className={styles.actionBtn}>
          <CommentIcon />
          {data.stats.comments}
        </button>
        <div className={styles.actionSpacer} />
        <button className={styles.actionBtn} aria-label="Compartilhar">
          <ShareIcon />
        </button>
      </footer>
    </article>
  )
}

// Icons
function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="2.5"/>
      <circle cx="17.5" cy="15.5" r="2.5"/>
      <path d="M8 17V5l12-2v12"/>
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )
}

function RankingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function ExploreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  )
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
    </svg>
  )
}

function ThumbUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
    </svg>
  )
}

function ThumbDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )
}