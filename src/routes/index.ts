
import { Router, Request, Response, NextFunction } from 'express'
import produtosRouter from './produtos.router'
const router = Router()

router.use('/produto', produtosRouter)

router.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Welcome to the api')
  return next()
})

export default router
