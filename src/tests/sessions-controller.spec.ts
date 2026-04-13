import request from 'supertest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('SessionsController', () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: user_id },
    })

    await prisma.$disconnect()
  })

  it('should authenticate a and get access token', async () => {
    const userResponse = await request(app).post('/users').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    })

    user_id = userResponse.body.id

    const sessionsResponse = await request(app).post('/sessions').send({
      email: 'testuser@example.com',
      password: 'password123',
    })

    expect(sessionsResponse.status).toBe(200)
    expect(sessionsResponse.body.token).toEqual(expect.any(String))
  })
})
