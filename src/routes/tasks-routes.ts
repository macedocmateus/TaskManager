import { Router } from 'express'

import { TasksController } from '@/controllers/tasks-controller.js'
import { TasksHistoryController } from '@/controllers/tasks-history-controller.js'
import { ensureAuthenticated } from '@/middlewares/ensure-authenticated.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'

const tasksRoutes = Router()
const tasksController = new TasksController()
const tasksHistoryController = new TasksHistoryController()

tasksRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  tasksController.create,
)
tasksRoutes.get(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['admin', 'member']),
  tasksController.index,
)
tasksRoutes.put(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin', 'member']),
  tasksController.update,
)
tasksRoutes.delete(
  '/:id',
  ensureAuthenticated,
  verifyUserAuthorization(['admin']),
  tasksController.remove,
)
tasksRoutes.get(
  '/:id/history',
  ensureAuthenticated,
  verifyUserAuthorization(['admin', 'member']),
  tasksHistoryController.index,
)

export { tasksRoutes }
