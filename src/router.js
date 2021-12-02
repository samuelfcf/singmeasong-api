import { Router } from 'express';
import recommendationRouter from './routes/recommention.routes.js';

const router = Router();

router.get('/status', (_, res) => {
  return res.status(200).send({
    message: 'Server is ok!'
  });
});

router.use('/recommendation', recommendationRouter);

export default router;
