import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'
import { AppError } from '@/utils/AppError.js'

class TeamMembersController {
  async create(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      userId: z.uuid(),
    })

    const { id: teamId } = paramsSchema.parse(request.params)
    const { userId } = bodySchema.parse(request.body)

    const team = await prisma.team.findUnique({ where: { id: teamId } })

    if (!team) {
      throw new AppError('Team not found')
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new AppError('User not found')
    }

    const alreadyMember = await prisma.teamMember.findFirst({
      where: { teamId, userId },
    })

    if (alreadyMember) {
      throw new AppError('User is already a member of this team')
    }

    const teamMember = await prisma.teamMember.create({
      data: { teamId, userId },
    })

    return response.status(201).json(teamMember)
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
      userId: z.uuid(),
    })

    const { id: teamId, userId } = paramsSchema.parse(request.params)

    const team = await prisma.team.findUnique({ where: { id: teamId } })

    if (!team) {
      throw new AppError('Team not found')
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new AppError('User not found')
    }

    const alreadyMember = await prisma.teamMember.findFirst({
      where: {
        userId,
        teamId,
      },
    })

    if (!alreadyMember) {
      throw new AppError('User is not a member of this team')
    }

    const teamMember = await prisma.teamMember.delete({
      where: { id: alreadyMember.id },
    })

    return response.status(200).send()
  }

  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id: teamId } = paramsSchema.parse(request.params)

    const team = await prisma.team.findUnique({ where: { id: teamId } })

    if (!team) {
      throw new AppError('Team not found')
    }

    const teamMembers = await prisma.teamMember.findMany({ where: { teamId } })

    return response.status(200).json(teamMembers)
  }
}

export { TeamMembersController }
