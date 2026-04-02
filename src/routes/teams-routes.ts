import { Router } from 'express'
import { TeamMembersController } from '@/controllers/team-members-controller.js'
import { TeamsController } from '@/controllers/teams-controller.js'

import { ensureAuthenticated } from '@/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'

const teamsRoutes = Router()
const teamsController = new TeamsController()
const teamMembersController = new TeamMembersController()

teamsRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  teamsController.create,
)
teamsRoutes.get(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  teamsController.index,
)
teamsRoutes.put(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  teamsController.update,
)
teamsRoutes.delete(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  teamsController.remove,
)

teamsRoutes.post(
  '/:id/members',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  teamMembersController.create,
)
teamsRoutes.get(
  '/:id/members',
  ensureAuthenticated,
  verifyUserAuthorization(['member', 'admin']),
  teamMembersController.index,
)
teamsRoutes.delete(
  '/:id/members/:userId',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  teamMembersController.remove,
)

export { teamsRoutes }
