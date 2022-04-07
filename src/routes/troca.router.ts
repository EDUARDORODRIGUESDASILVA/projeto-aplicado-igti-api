import { Router } from 'express'
import trocaController from '../controllers/troca.controller'

const router = Router()
router.post('/', trocaController.create)
router.delete('/:unidadeId', trocaController.cancelarTroca)
router.patch('/:unidadeId', trocaController.homologarTroca)
// router.get('/:id', unidadesController.getById)
router.get('/relatorio/:unidadeId', trocaController.getRelatorio)

export default router
