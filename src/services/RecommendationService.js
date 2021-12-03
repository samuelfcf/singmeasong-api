import RecommendationRepository from '../repositories/RecommendationRepository.js';
import AppError from '../errors/AppError.js';
import validateYoutubeLink from '../utils/ValidateYoutubeLink.js';

class RecommendationService {
  async newRecommendation({ name, youtubeLink }) {
    const isValidLink = validateYoutubeLink(youtubeLink);
    if (!isValidLink) {
      throw new AppError('Not a youtube link', 400);
    }

    const recommendationRepository = new RecommendationRepository();
    const recommendationExists = await recommendationRepository.findByLink({
      youtubeLink
    });
    if (recommendationExists) {
      throw new AppError('Recommendation already exists', 409);
    }

    const recommendation = await recommendationRepository.create({
      name,
      youtubeLink
    });

    return recommendation;
  }

  async upvote({ id }) {
    const recommendationRepository = new RecommendationRepository();

    const recommendationExists = await recommendationRepository.findById({
      id
    });
    if (!recommendationExists) {
      throw new AppError('Recommendations does not exists');
    }

    const recommendationUpvoted = await recommendationRepository.upvote({ id });
    return recommendationUpvoted;
  }

  async downvote({ id }) {
    const recommendationService = new RecommendationRepository();

    const recommendationExists = await recommendationService.findById({ id });
    if (!recommendationExists) {
      throw new AppError('Recommendations does not exists');
    }

    if (recommendationExists.score <= -5) {
      return recommendationService.deleteById({ id });
    }

    const recommendationDownvoted = await recommendationService.downvote({
      id
    });
    return recommendationDownvoted;
  }

  async getRandomRecommendation() {
    const recommendationRepository = new RecommendationRepository();

    const allRecommendations = await recommendationRepository.findAll();
    if (!allRecommendations) {
      throw new AppError('No recommendations yet', 404);
    }

    const onlyHasScoreBiggerThanTen = allRecommendations.every(
      (r) => r.score > 10
    );
    const onlyHasScoreLowerOrEqualThanTen = allRecommendations.every(
      (r) => r.score <= 10
    );

    if (onlyHasScoreBiggerThanTen || onlyHasScoreLowerOrEqualThanTen) {
      const randomRecommendation = Math.floor(
        Math.random() * allRecommendations.length
      );
      return randomRecommendation;
    }

    const isHighProbability = Math.floor(Math.random() * 10) < 7;
    if (!isHighProbability) {
      return null;
    }

    return null;
  }
}

export default RecommendationService;
