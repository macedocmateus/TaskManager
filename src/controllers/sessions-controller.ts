import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { authConfig } from '@/configs/auth.js'
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

    const { secret, expiresIn } = authConfig.jwt

    const { sign } = jwt

    const token = sign({ role: user.role ?? 'member' }, secret, {
      subject: user.id,
      expiresIn,
    })

    const { password: hashedPassword, ...userWithoutPassword } = user

    return response.json({ token, user: userWithoutPassword })
  }
}

export { SessionsController }
