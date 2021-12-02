import { Router } from 'express';
import recommendationRouter from './routes/recommention.routes.js';
import HandleErrors from './middlewares/HandleErrors.js';

const router = Router();

router.get('/status', (_, res) => {
  return res.status(200).send({
    message: 'Server is ok!'
  });
});

router.use('/recommendation', recommendationRouter);

router.use(HandleErrors);

export default router;
