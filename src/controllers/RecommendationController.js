import RecommendationService from '../services/RecommendationService.js';
import joi from 'joi';
import HelperResponse from '../helpers/HelperResponse.js';

const recommendationSchema = joi.object({
  name: joi.string().required(),
  youtubeLink: joi.string().required()
});

const updateRecommendationSchame = joi.object({
  id: joi.string().required()
});

class RecommendationController {
  async create(req, res, next) {
    try {
      const { name, youtubeLink } = req.body;
      const { error } = recommendationSchema.validate({ name, youtubeLink });
      if (error) return next(error.details);

      const recommendationService = new RecommendationService();
      const recommendation = await recommendationService.newRecommendation({
        name,
        youtubeLink
      });

      return HelperResponse.success(res, {
        message: 'Recommendation created successfully',
        status: 201,
        data: recommendation
      });
    } catch (err) {
      console.log(err);
      return HelperResponse.failed(res, err);
    }
  }

  async upvote(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = updateRecommendationSchame.validate({ id });
      if (error) return next(error.details);

      const recommendationService = new RecommendationService();
      const recommendationUpvoted = await recommendationService.upvote({ id });

      return HelperResponse.success(res, {
        message: 'Upvote done successfully',
        data: recommendationUpvoted
      });
    } catch (err) {
      console.log(err);
      return HelperResponse.failed(res, err);
    }
  }

  async downvote(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = updateRecommendationSchame.validate({ id });
      if (error) return next(error.details);

      const recommendationService = new RecommendationService();
      const recommendationDownvoted = await recommendationService.downvote({
        id
      });

      return HelperResponse.success(res, {
        message: 'Downvote done successfully',
        data: recommendationDownvoted
      });
    } catch (err) {
      console.log(err);
      return HelperResponse.failed(res, err);
    }
  }

  async getRandomRecommendation(_, res, __) {
    try {
      const recommendationService = new RecommendationService();
      const recomendation =
        await recommendationService.getRandomRecommendation();

      return HelperResponse.success(res, {
        data: recomendation
      });
    } catch (err) {
      console.log(err);
      return HelperResponse.failed(res, err);
    }
  }
}

export default new RecommendationController();
