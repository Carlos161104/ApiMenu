import express, { json } from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users.js'
import { dishesRouter } from './routes/dishes.js'
import { reviewsRouter } from './routes/reviews.js'

const app = express()

// Middlewares
app.disable('x-powered-by')
app.use(cors())
app.use(json())

// users Route
app.use('/users', usersRouter)

// dishes Route
app.use('/dishes', dishesRouter)

// reviews Route
app.use('/reviews', reviewsRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
