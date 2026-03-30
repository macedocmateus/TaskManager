import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'
import { AppError } from '@/utils/AppError.js'

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      description: z.string().trim().nullish(),
    })

    const { name, description } = bodySchema.parse(request.body)

    const teamWithSameTeamName = await prisma.team.findFirst({
      where: { name },
    })

    if (teamWithSameTeamName) {
      throw new AppError('Team with same name already exists')
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
      },
    })

    return response.status(201).json(team)
  }
}

export { TeamsController }
