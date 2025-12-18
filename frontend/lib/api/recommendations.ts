const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface CreateRecommendationPayload {
  title: string
  artist: string
  genre: string
  description: string
  tags: string[]
  mediaUrl?: string
  coverImage?: File | null
}

export interface Recommendation {
  id: number
  user: {
    id: number
    name: string
    avatar: string | null
  }
  music: {
    id: number
    title: string
    artist: string
    genre: string
    coverUrl: string | null
    link: string
  }
  description: string
  tags: string[]
  stats: {
    upvotes: number
    downvotes: number
    comments: number
  }
  createdAt: string
  userVote?: 'up' | 'down' | null
  isFavorite?: boolean
}

export interface RecommendationResponse {
  success: boolean
  data: Recommendation
}

export async function createRecommendation(payload: CreateRecommendationPayload): Promise<RecommendationResponse> {
  const formData = new FormData()

  // Adicionamos os campos textuais
  formData.append('title', payload.title)
  formData.append('artist', payload.artist)
  formData.append('genre', payload.genre)
  formData.append('description', payload.description)
  formData.append('mediaUrl', payload.mediaUrl || '')
  
  // Arrays precisam ser enviados de forma específica ou serializada dependendo do backend
  // Opção 1: Enviar string JSON (mais fácil para tratar no Elysia)
  formData.append('tags', JSON.stringify(payload.tags)) 
  
  // Adicionamos a imagem se existir
  if (payload.coverImage) {
    formData.append('coverImage', payload.coverImage)
  }

  const response = await fetch(`${API_BASE_URL}/v1/recommendations`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao criar recomendação' }))
    throw new Error(error.error || error.message || `HTTP ${response.status}`)
  }

  return response.json()
}
export interface RecommendationsListResponse {
  success: boolean
  data: Recommendation[]
  pagination: {
    limit: number
    offset: number
  }
}

export interface GetRecommendationsParams {
  limit?: number
  offset?: number
  userId?: number
  sortBy?: 'recent' | 'trending' | 'top'
  period?: 'today' | 'week' | 'month' | 'all'
  genre?: string
}

export async function getRecommendations(
  limit = 10, 
  offset = 0,
  userId?: number,
  sortBy?: 'recent' | 'trending' | 'top',
  period?: 'today' | 'week' | 'month' | 'all',
  genre?: string
): Promise<RecommendationsListResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  })
  
  if (userId) params.set('userId', userId.toString())
  if (sortBy) params.set('sortBy', sortBy)
  if (period) params.set('period', period)
  if (genre && genre !== 'all') params.set('genre', genre)

  const response = await fetch(`${API_BASE_URL}/v1/recommendations?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar recomendações')
  }

  return response.json()
}

export interface VoteResponse {
  success: boolean
  data: {
    action: 'created' | 'removed' | 'changed'
    voteType: 'upvote' | 'downvote' | null
  }
}

export async function voteRecommendation(
  postId: number, 
  voteType: 'upvote' | 'downvote'
): Promise<VoteResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/recommendations/${postId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ voteType }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao votar' }))
    throw new Error(error.error || error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export interface RankingUser {
  id: number
  position: number
  name: string
  avatar: string | null
  isArtist: boolean
  stats: {
    recommendations: number
    totalVotes: number
    followers: number
  }
}

export interface RankingsResponse {
  success: boolean
  data: RankingUser[]
}

export async function getRankings(
  type: 'curators' | 'artists' = 'curators',
  period: 'week' | 'month' | 'all' = 'all',
  limit = 20
): Promise<RankingsResponse> {
  const params = new URLSearchParams({
    type,
    period,
    limit: limit.toString(),
  })

  const response = await fetch(`${API_BASE_URL}/v1/recommendations/rankings?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar rankings')
  }

  return response.json()
}