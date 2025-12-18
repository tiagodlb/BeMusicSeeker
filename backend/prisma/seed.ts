import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { DB } from '../src/db/types'
import * as dotenv from 'dotenv'

dotenv.config()

// Configuração do Kysely
const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

// Hash fake para senha "123456"
const PASSWORD_HASH = "$2a$12$VjXo/vK.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8.Z8" 

async function main() {
  console.log('🌱 Iniciando seed com Kysely...')

  // 1. Limpar banco
  console.log('🧹 Limpando dados antigos...')
  await db.deleteFrom('notifications').execute()
  await db.deleteFrom('post_tags').execute()
  await db.deleteFrom('votes').execute()
  await db.deleteFrom('comments').execute()
  await db.deleteFrom('posts').execute()
  await db.deleteFrom('saved_songs').execute()
  await db.deleteFrom('songs').execute()
  await db.deleteFrom('follows').execute()
  await db.deleteFrom('users').execute()

  // 2. Criar Usuário Admin
  console.log('👤 Criando Admin...')
  const admin = await db
    .insertInto('users')
    .values({
      email: 'admin@bemusic.com',
      name: 'Admin User',
      password_hash: PASSWORD_HASH,
      bio: 'O criador deste universo musical.',
      profile_picture_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      is_artist: false,
      social_links: JSON.stringify({ instagram: '@admin' }),
      updated_at: new Date()
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  // 3. Criar Outros Usuários
  console.log('👥 Criando usuários...')
  const usersData = [
    { name: 'Alice Rocker', email: 'alice@rock.com', is_artist: true, bio: 'Rock never dies 🎸', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
    { name: 'Bob Jazz', email: 'bob@jazz.com', is_artist: true, bio: 'Smooth saxophone vibes 🎷', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400' },
    { name: 'Carol Pop', email: 'carol@pop.com', is_artist: true, bio: 'Diva do Pop BR ✨', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
    { name: 'Dan Critic', email: 'dan@critic.com', is_artist: false, bio: 'Analiso letras profundamente.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  ]

  const userIds: number[] = []

  for (const u of usersData) {
    const res = await db.insertInto('users').values({
      email: u.email,
      name: u.name,
      password_hash: PASSWORD_HASH,
      bio: u.bio,
      is_artist: u.is_artist,
      profile_picture_url: u.img,
      social_links: '{}',
      updated_at: new Date()
    }).returning('id').executeTakeFirstOrThrow()
    userIds.push(res.id)
  }

  // CORREÇÃO: Usamos o "!" para garantir ao TS que esses índices existem
  const aliceId = userIds[0]!
  const bobId = userIds[1]!
  // const carolId = userIds[2]! // Não estamos usando ainda, comentado para evitar erro de unused
  const danId = userIds[3]!

  // 4. Criar Músicas
  console.log('🎵 Criando músicas...')
  const songsRes = await db.insertInto('songs').values([
    { 
      title: 'Neon Lights', 
      artist_id: aliceId, 
      genre: 'Rock', 
      duration_seconds: 210, 
      file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
      cover_image_url: 'https://picsum.photos/seed/neon/400/400',
      moderation_status: 'approved',
      updated_at: new Date()
    },
    { 
      title: 'Smooth Talk', 
      artist_id: bobId, 
      genre: 'Jazz', 
      duration_seconds: 180, 
      file_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      cover_image_url: 'https://picsum.photos/seed/smooth/400/400',
      moderation_status: 'approved',
      updated_at: new Date()
    }
  ]).returning('id').execute()

  // CORREÇÃO: Usamos "!" para garantir que o array tem elementos
  const neonSongId = songsRes[0]!.id
  const smoothSongId = songsRes[1]!.id

  // 5. Criar Posts
  console.log('📝 Criando posts...')
  
  // Post do Admin
  const post1 = await db.insertInto('posts').values({
    user_id: admin.id,
    song_id: smoothSongId,
    content: 'Jazz para relaxar no fim de semana! #chill #jazz',
    upvotes_count: 5,
    comments_count: 1,
    updated_at: new Date()
  }).returning('id').executeTakeFirstOrThrow()

  await db.insertInto('post_tags').values([
    { post_id: post1.id, tag: 'chill' },
    { post_id: post1.id, tag: 'jazz' }
  ]).execute()

  // Post do Dan
  const post2 = await db.insertInto('posts').values({
    user_id: danId,
    song_id: neonSongId,
    content: 'Essa guitarra está insana! #rock #energy',
    upvotes_count: 10,
    comments_count: 0,
    updated_at: new Date()
  }).returning('id').executeTakeFirstOrThrow()

  await db.insertInto('post_tags').values([
    { post_id: post2.id, tag: 'rock' },
    { post_id: post2.id, tag: 'energy' }
  ]).execute()

  // 6. Criar Seguidores
  console.log('🤝 Criando conexões...')
  await db.insertInto('follows').values({ follower_id: aliceId, following_id: admin.id }).execute()
  await db.insertInto('follows').values({ follower_id: admin.id, following_id: bobId }).execute()

  // 7. Criar Notificações
  console.log('🔔 Criando notificações...')
  await db.insertInto('notifications').values([
    {
      user_id: admin.id,
      type: 'follow',
      content: 'Alice Rocker começou a seguir você',
      related_id: aliceId,
      related_type: 'user',
      is_read: false
    },
    {
      user_id: admin.id,
      type: 'comment',
      content: 'Dan Critic comentou no seu post: "Muito bom!"',
      related_id: post1.id,
      related_type: 'post',
      is_read: false
    },
    {
      user_id: admin.id,
      type: 'vote',
      content: 'Carol Pop curtiu sua recomendação',
      related_id: post1.id,
      related_type: 'post',
      is_read: true 
    }
  ]).execute()

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .then(async () => {
    await db.destroy()
  })
  .catch(async (e) => {
    console.error(e)
    await db.destroy()
    process.exit(1)
  })