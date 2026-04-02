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

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany()

    return response.status(200).json(teams)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      name: z.string().trim().min(3).optional(),
      description: z.string().trim().nullish(),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, description } = bodySchema.parse(request.body)

    const team = await prisma.team.findUnique({ where: { id } })

    if (!team) {
      throw new AppError('Team not found')
    }

    if (name && name !== team.name) {
      const teamWithSameName = await prisma.team.findFirst({ where: { name } })

      if (teamWithSameName) {
        throw new AppError('Team with same name already exists')
      }
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: { name, description },
    })

    return response.status(200).json(updatedTeam)
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const team = await prisma.team.findUnique({ where: { id } })

    if (!team) {
      throw new AppError('Team not found')
    }

    await prisma.team.delete({ where: { id } })

    return response.status(200).send()
  }
}

export { TeamsController }
