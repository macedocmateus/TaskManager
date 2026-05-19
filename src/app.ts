import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import { load } from 'js-yaml'
import { JsonObject, serve, setup } from 'swagger-ui-express'
import { errorHandling } from '@/middlewares/error-handling.js'
import { routes } from '@/routes/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const swaggerDocument = load(
  readFileSync(resolve(__dirname, 'docs', 'swagger.yml'), 'utf-8'),
) as JsonObject

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use('/docs', serve, setup(swaggerDocument))

app.use(errorHandling)

export { app }
