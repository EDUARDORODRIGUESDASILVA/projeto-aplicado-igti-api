import { Router } from 'express'
import objetivoController from '../controllers/objetivo.controller'
// import { authorize } from '../lib/auth.middleware'

const router = Router()
// authorize('admin')
router.post('/', objetivoController.create)
router.put('/', objetivoController.update)
router.delete('/:id', objetivoController.deleteById)

router.get('/', objetivoController.getAll)
router.get('/:id', objetivoController.getById)
export default router
