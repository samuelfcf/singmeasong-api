import { Router } from 'express';
import { httpStatus } from './utils/constants.js';
import recommendationRouter from './routes/recommention.routes.js';

const router = Router();

router.get('/status', (_, res) => {
  return res.status(httpStatus.SUCCESS).send({
    message: 'Server is ok!'
  });
});

router.use('/recommendations', recommendationRouter);

export default router;
