import RecommendationRepository from '../repositories/RecommendationRepository.js';
import AppError from '../errors/AppError.js';
import validateYoutubeLink from '../utils/ValidateYoutubeLink.js';

class RecommendationService {
  async newRecommendation({ name, youtubeLink }) {
    const isValidLink = validateYoutubeLink(youtubeLink);
    if (!isValidLink) {
      throw new AppError('Not a youtube link', 400);
    }

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
