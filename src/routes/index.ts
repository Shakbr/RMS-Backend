import express from 'express';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import waybillRoutes from './waybillRoutes';
// import bookRoutes from './bookRoutes';

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/companies', companyRoutes);
router.use('/waybills', waybillRoutes);

export default router;
