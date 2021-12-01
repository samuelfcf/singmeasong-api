import { Router } from 'express';

const router = Router();

router.get('/status', (_, res) => {
  return res.status(200).send({
    message: 'Server is ok!'
  });
});

export default router;
