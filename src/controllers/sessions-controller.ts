import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'
import { AppError } from '@/utils/AppError.js'

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('Invalid email or password', 401)
    }

    return response.json({ message: 'ok' })
  }
}

export { SessionsController }
