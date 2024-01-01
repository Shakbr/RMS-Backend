import express from 'express';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import waybillRoutes from './waybillRoutes';
import productRoutes from './productRoutes';

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/companies', companyRoutes);
router.use('/waybills', waybillRoutes);
router.use('/products', productRoutes);

export default router;
