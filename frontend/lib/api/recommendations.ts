const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface CreateRecommendationPayload {
  title: string
  artist: string
  genre: string
  description: string
  tags: string[]
  mediaUrl?: string
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
}

export interface RecommendationResponse {
  success: boolean
  data: Recommendation
}

export async function createRecommendation(payload: CreateRecommendationPayload): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/v1/recommendations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao criar recomendação' }))
    throw new Error(error.message || `HTTP ${response.status}`)
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

export async function getRecommendations(limit = 10, offset = 0): Promise<RecommendationsListResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  })

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