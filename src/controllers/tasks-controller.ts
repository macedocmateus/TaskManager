import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'
import { AppError } from '@/utils/AppError.js'

class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().trim().min(3),
      description: z.string().trim().nullish(),
      assignedTo: z.uuid(),
      teamId: z.uuid(),
    })

    const { title, description, assignedTo, teamId } = bodySchema.parse(
      request.body,
    )

    const assignedToId = await prisma.user.findUnique({
      where: { id: assignedTo },
    })

    if (!assignedToId) {
      throw new AppError('User not found')
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    })

    if (!team) {
      throw new AppError('Team not found')
    }

    const alreadyMember = await prisma.teamMember.findFirst({
      where: {
        userId: assignedTo,
        teamId,
      },
    })

    if (!alreadyMember) {
      throw new AppError('User is not a member of this team')
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo,
        teamId,
      },
    })

    return response.status(201).json(task)
  }
}

export { TasksController }
