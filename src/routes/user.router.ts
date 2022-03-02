import { Router } from 'express'
// import { authorize } from '../lib/auth.middleware'
import userController from '../controllers/user.controller'

const router = Router()
router.get('/', userController.getLoggedUser)
router.get('/:matricula', userController.getByMatricula)
export default router
