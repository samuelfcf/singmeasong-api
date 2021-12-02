import { Router } from 'express';
import RecommendationController from '../controllers/RecommendationController.js';

const recommendationRouter = Router();

recommendationRouter.post('/', RecommendationController.create);

export default recommendationRouter;
