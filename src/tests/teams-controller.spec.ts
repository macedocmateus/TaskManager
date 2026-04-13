import request from 'supertest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('TeamsController', () => {
  let team_id: string
  let user_id: string
  let token: string

  beforeAll(async () => {
    const userResponse = await request(app).post('/users').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    })

    user_id = userResponse.body.id

    await prisma.user.update({
      where: { id: user_id },
      data: { role: 'admin' },
    })

    const sessionsResponse = await request(app).post('/sessions').send({
      email: 'testuser@example.com',
      password: 'password123',
    })

    expect(sessionsResponse.status).toBe(200)
    expect(sessionsResponse.body.token).toEqual(expect.any(String))

    token = sessionsResponse.body.token
  })

  afterAll(async () => {
    await prisma.team.deleteMany({
      where: { id: team_id },
    })

    await prisma.user.deleteMany({
      where: { id: user_id },
    })

    await prisma.$disconnect()
  })

  it('should create a new team successfully', async () => {
    const response = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Team',
        description: 'testtest',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test Team')

    team_id = response.body.id
  })
})
