import { Router } from 'express'
import userController from '../controllers/user.controller'

const router = Router()
router.get('/list', userController.getUsersByAutorizacao)
router.get('/', userController.getLoggedUser)
router.get('/:matricula', userController.getByMatricula)
router.post('/', userController.create)
router.put('/', userController.update)
router.delete('/:matricula', userController.destroy)
export default router
