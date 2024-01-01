import { CakeController } from '@/controllers/cakeController';
import { Router } from 'express';

const router = Router();
const controller = new CakeController();

router.post('/', controller.create);
