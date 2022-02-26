import { Router } from 'express'
import produtoController from '../controllers/produto.controller'
// import { authorize } from '../lib/auth.middleware'

const router = Router()
// authorize('admin')
router.post('/', produtoController.create)
router.delete('/:id', produtoController.destroy)
router.put('/', produtoController.update)
router.get('/', produtoController.getAll)
router.get('/:id', produtoController.getById)
export default router
