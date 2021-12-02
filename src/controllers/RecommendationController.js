import RecommendationService from '../services/RecommendationService.js';
import joi from 'joi';

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

      return res.status(201).send({
        data: recommendation
      });
    } catch (err) {
      return res.status(err.status).send({
        message: err.message
      });
    }
  }
}

export default new RecommendationController();