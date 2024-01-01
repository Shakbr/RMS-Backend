import { productController } from '@/controllers/productController';
import { Router } from 'express';

const router = Router();
const controller = new productController();

// TODO this should be protected
// router.use(protect);
router.get('/', controller.findAll);

export default router;
