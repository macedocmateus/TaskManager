import { Request, Response } from 'express'
import { prisma } from '@/lib/prisma.js'

class HeathController {
  async check(_request: Request, response: Response) {
    try {
      await prisma.$queryRaw`SELECT 1`

      return response.status(200).json({
        Server: '✅ UP',
        Database: '✅ Online',
      })
    } catch (error) {
      return response.status(503).json({
        Server: '✅ UP',
        Database: '❌ Offline',
      })
    }
  }
}

export { HeathController }
