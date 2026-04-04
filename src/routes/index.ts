import { Router } from 'express'

import { usersRoutes } from '@/routes/users-routes.js'
import { sessionsRoutes } from './sessions-routes.js'
import { tasksRoutes } from './tasks-routes.js'
import { teamsRoutes } from './teams-routes.js'

const routes = Router()
routes.use('/users', usersRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/teams', teamsRoutes)
routes.use('/tasks', tasksRoutes)

export { routes }
