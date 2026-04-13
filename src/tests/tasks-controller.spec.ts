import request from 'supertest'

import { app } from '@/app.js'
import { prisma } from '@/lib/prisma.js'

describe('TasksController', () => {
  let team_id: string
  let user_id: string
  let token: string
  let task_id: string

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

    const teamResponse = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Team',
        description: 'testtest',
      })

    expect(teamResponse.status).toBe(201)
    expect(teamResponse.body).toHaveProperty('id')
    expect(teamResponse.body.name).toBe('Test Team')

    team_id = teamResponse.body.id

    await request(app)
      .post(`/teams/${team_id}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user_id,
      })
  })

  afterAll(async () => {
    await prisma.taskHistory.deleteMany({
      where: { taskId: task_id },
    })

    await prisma.task.deleteMany({
      where: { id: task_id },
    })

    await prisma.teamMember.deleteMany({
      where: { teamId: team_id },
    })

    await prisma.team.deleteMany({
      where: { id: team_id },
    })

    await prisma.user.deleteMany({
      where: { id: user_id },
    })

    await prisma.$disconnect()
  })

  it('should create a new task successfully', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'test test',
        description: 'test description',
        assignedTo: user_id,
        teamId: team_id,
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.title).toBe('test test')

    task_id = response.body.id
  })
})
