// Importa os tipos Request e Response do Express para tipar os parâmetros do método
import { Request, Response } from 'express'
// Importa o Zod para validação e parsing dos dados de entrada
import { z } from 'zod'
// Importa a instância do Prisma Client para interagir com o banco de dados
import { prisma } from '@/lib/prisma.js'
// Importa a classe de erro customizado da aplicação para retornar erros tratados
import { AppError } from '@/utils/AppError.js'

class TeamMembersController {
  // Método responsável por adicionar um usuário como membro de um time
  async create(request: Request, response: Response) {
    // Define o schema de validação para os parâmetros da rota (ex: /teams/:id/members)
    const paramsSchema = z.object({
      id: z.uuid(), // O id do time deve ser um UUID válido
    })

    // Define o schema de validação para o corpo da requisição
    const bodySchema = z.object({
      userId: z.uuid(), // O userId do usuário a ser adicionado deve ser um UUID válido
    })

    // Faz o parse e a validação dos params da rota, renomeando "id" para "teamId"
    const { id: teamId } = paramsSchema.parse(request.params)
    // Faz o parse e a validação do body da requisição, extraindo o userId
    const { userId } = bodySchema.parse(request.body)

    // Busca no banco de dados um time com o teamId informado
    const team = await prisma.team.findUnique({ where: { id: teamId } })

    // Se o time não for encontrado, lança um erro tratado com status 400
    if (!team) {
      throw new AppError('Team not found')
    }

    // Busca no banco de dados um usuário com o userId informado
    const user = await prisma.user.findUnique({ where: { id: userId } })

    // Se o usuário não for encontrado, lança um erro tratado com status 400
    if (!user) {
      throw new AppError('User not found')
    }

    // Verifica se já existe um vínculo entre esse usuário e esse time na tabela team_members
    const alreadyMember = await prisma.teamMember.findFirst({
      where: { teamId, userId },
    })

    // Se o usuário já for membro do time, lança um erro para evitar duplicidade
    if (alreadyMember) {
      throw new AppError('User is already a member of this team')
    }

    // Cria o vínculo entre o usuário e o time na tabela team_members
    const teamMember = await prisma.teamMember.create({
      data: { teamId, userId },
    })

    // Retorna o registro criado com o status 201 (Created)
    return response.status(201).json(teamMember)
  }

  // Método responsável por remover um usuário como membro de um time
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
