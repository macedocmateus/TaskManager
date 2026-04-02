import { Router } from 'express'

import { TeamsController } from '@/controllers/teams-controller.js'

import { ensureAuthenticated } from '@/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.use(ensureAuthenticated, verifyUserAuthorization(['admin']))
teamsRoutes.post('/', teamsController.create)
teamsRoutes.get('/', teamsController.index)
teamsRoutes.put('/:id', teamsController.update)
teamsRoutes.delete('/:id', teamsController.remove)

export { teamsRoutes }
