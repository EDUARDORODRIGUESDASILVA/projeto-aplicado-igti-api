
import { Router, Request, Response, NextFunction } from 'express'
import produtosRouter from './produtos.router'
import userRouter from './user.router'
const router = Router()

router.use('/produto', produtosRouter)

router.use('/user', userRouter)

router.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Welcome to the api')
  return next()
})

export default router
