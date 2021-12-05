import { Router } from 'express';
import RecommendationController from '../controllers/RecommendationController.js';

const recommendationRouter = Router();

recommendationRouter.post('/', RecommendationController.create);
recommendationRouter.post('/:id/upvote', RecommendationController.upvote);
recommendationRouter.post('/:id/downvote', RecommendationController.downvote);
recommendationRouter.get(
  '/random',
  RecommendationController.getRandomRecommendation
);
recommendationRouter.get(
  '/top/:amount',
  RecommendationController.getTopRecommendations
);

export default recommendationRouter;
