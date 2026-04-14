import { Router } from 'express'

import { HeathController } from '@/controllers/health-controller.js'

const healthRoutes = Router()
const healthController = new HeathController()

healthRoutes.get('/', healthController.check)

export { healthRoutes }
