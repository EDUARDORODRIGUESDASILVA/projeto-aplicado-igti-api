import { Router } from 'express'
import unidadesController from '../controllers/unidades.controller'

const router = Router()
router.post('/', unidadesController.create)
router.delete('/:id', unidadesController.deleteById)
router.put('/', unidadesController.update)
router.get('/:id', unidadesController.getById)
router.get('/vinc/:id', unidadesController.getByParentId)

export default router
