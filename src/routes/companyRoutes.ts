import { CompanyController } from './../controllers/companyController';
import express from 'express';
import { protect } from '@/middlewares/authMiddleware';

const router = express.Router();
const controller = new CompanyController();

router.use(protect);
router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
