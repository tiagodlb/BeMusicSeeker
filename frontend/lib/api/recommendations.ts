const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface CreateRecommendationPayload {
  title: string
  artist: string
  genre: string
  description: string
  tags: string[]
  mediaUrl?: string
}

export async function createRecommendation(payload: CreateRecommendationPayload) {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao criar recomendação')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao criar recomendação:', error)
    throw error
  }
}

export async function getRecommendations(limit = 10, offset = 0) {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })

    const response = await fetch(
      `${API_BASE_URL}/v1/recommendations?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar recomendações')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error)
    throw error
  }
}

function getAuthToken(): string {
  // TODO: Implementar recuperação do token do localStorage ou cookie
  // Por enquanto retorna uma string vazia
  return localStorage?.getItem('authToken') || ''
}
