import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import { errorHandling } from '@/middlewares/error-handling.js'
import { routes } from '@/routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use(errorHandling)

export { app }
