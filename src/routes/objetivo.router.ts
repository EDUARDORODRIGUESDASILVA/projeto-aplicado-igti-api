import { Router } from 'express'
import objetivoController from '../controllers/objetivo.controller'
import relatorioController from '../controllers/relatorio.controller'
// import { authorize } from '../lib/auth.middleware'

const router = Router()
// authorize('admin')
router.post('/', objetivoController.create)
router.put('/', objetivoController.update)
router.delete('/:id', objetivoController.deleteById)

router.get('/', objetivoController.getByQuery)
router.get('/:id', objetivoController.getById)

router.get('/agregador/:id', objetivoController.totalizaAgregador)
router.get('/ajustar/:unidadeId/:produtoId', objetivoController.getAjustePorAgregador)
router.post('/ajustar/:unidadeId/:produtoId', objetivoController.atualizarObjetivosLote)

router.get('/relatorio/:unidadeId', relatorioController.getRelatorio)

export default router
