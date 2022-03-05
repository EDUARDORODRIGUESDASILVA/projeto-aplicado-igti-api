
import { Router } from 'express'
import produtosRouter from './produtos.router'
import userRouter from './user.router'
import unidadeRouter from './unidades.router'
const router = Router()

router.use('/produto', produtosRouter)
router.use('/user', userRouter)
router.use('/unidade', unidadeRouter)

export default router
