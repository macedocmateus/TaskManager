import 'dotenv/config'

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import cors from 'cors'
import express from 'express'
import { load } from 'js-yaml'
import { JsonObject, serve, setup } from 'swagger-ui-express'
import { errorHandling } from '@/middlewares/error-handling.js'
import { routes } from '@/routes/index.js'

const swaggerDocument = load(
  readFileSync(resolve('src/docs/swagger.yml'), 'utf-8'),
) as JsonObject

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/docs', serve, setup(swaggerDocument))

app.use(errorHandling)

export { app }
