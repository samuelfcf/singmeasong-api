import RecommendationRepository from '../repositories/RecommendationRepository.js';
import AppError from '../errors/AppError.js';

class RecommendationService {
  async newRecommendation({ name, youtubeLink }) {
    const recommendationService = new RecommendationRepository();

    const recommendationExists = await recommendationService.findByLink({
      youtubeLink
    });

    if (recommendationExists) {
      throw new AppError('Recommendation already exists', 409);
    }

    const recommendation = await recommendationService.create({
      name,
      youtubeLink
    });
    return recommendation;
  }
}

export default RecommendationService;
