
import { Router } from 'express'
import produtosRouter from './produtos.router'
import userRouter from './user.router'
import unidadeRouter from './unidades.router'
import objetivoRouter from './objetivo.router'
import trocaRouter from './troca.router'
const router = Router()

router.use('/produto', produtosRouter)
router.use('/user', userRouter)
router.use('/unidade', unidadeRouter)
router.use('/objetivo', objetivoRouter)
router.use('/troca', trocaRouter)

export default router
