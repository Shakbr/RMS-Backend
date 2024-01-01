import { asyncHandler } from '@/helpers/asyncHandler';
import { CakeService } from '@/services/CakeService';
import { AuthRequest } from '@/types/types';
import { Response, NextFunction } from 'express';

export class CakeController {
  private cakeService: CakeService;

  constructor(cakeService: CakeService) {
    this.cakeService = cakeService;
  }

  create = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    // TODO add validation
    return await this.cakeService.createCake(req.body);
  });
}
