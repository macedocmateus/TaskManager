import { Request, Response } from 'express'

class UsersController {
  create(request: Request, response: Response) {
    return response.json({ message: 'oii' })
  }
}

export { UsersController }
