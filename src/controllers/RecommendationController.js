import RecommendationService from '../services/RecommendationService.js';
import joi from 'joi';
import Helper from '../utils/Helper.js';

const recommendationSchema = joi.object({
  name: joi.string().required(),
  youtubeLink: joi.string().required()
});

class RecommendationController {
  async create(req, res, next) {
    try {
      const { name, youtubeLink } = req.body;
      const { error } = recommendationSchema.validate({ name, youtubeLink });
      if (error) return next(error.details);

      if (!name || !youtubeLink) {
        return res.sendStatus(400);
      }

      const recommendationService = new RecommendationService();
      const recommendation = await recommendationService.newRecommendation({
        name,
        youtubeLink
      });

      return Helper.sucess(res, {
        message: 'Recommendation created successfully',
        data: recommendation
      });
    } catch (err) {
      console.log(err);
      return Helper.failed(res, err);
    }
  }
}

export default new RecommendationController();
