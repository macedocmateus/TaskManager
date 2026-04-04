import { Router } from 'express'

import { TasksController } from '@/controllers/tasks-controller.js'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  tasksController.create,
)

export { tasksRoutes }
