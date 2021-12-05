import RecommendationRepository from '../repositories/RecommendationRepository.js';
import AppError from '../errors/AppError.js';
import validateYoutubeLink from '../utils/validateYoutubeLink.js';
import getRandom from '../utils/getRandom.js';
import calculateProbability from '../utils/calculateProbability.js';
import checkScoreOverTen from '../utils/checkScoreOverTen.js';
import checkScoreUnderTen from '../utils/checkScoreUnderTen.js';

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
    const recommendationRepository = new RecommendationRepository();

    const recommendationExists = await recommendationRepository.findById({
      id
    });
    if (!recommendationExists) {
      throw new AppError('Recommendations does not exists');
    }

    if (recommendationExists.score <= -5) {
      return recommendationRepository.deleteById({ id });
    }

    const recommendationDownvoted = await recommendationRepository.downvote({
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

    const onlyHasScoreOverTen = checkScoreOverTen(allRecommendations);
    const onlyHasScoreUnderOrEqualThanTen =
      checkScoreUnderTen(allRecommendations);

    if (onlyHasScoreOverTen || onlyHasScoreUnderOrEqualThanTen) {
      const randomRecommendation = getRandom(allRecommendations);
      return randomRecommendation;
    }

    const isHighProbability = calculateProbability();
    let result;

    if (isHighProbability) {
      result = await recommendationRepository.findScoreOverTen();
    } else {
      result = await recommendationRepository.findScoreUnderTen();
    }

    const randomRecommendation = getRandom(result);
    return randomRecommendation;
  }

  async getTopRecommendations({ amount }) {
    const recomendationRepository = new RecommendationRepository();

    const topRecommendations = await recomendationRepository.findTops({
      limit: amount
    });

    if (amount > 0 && topRecommendations.length === 0) {
      throw new AppError('No recommendations yet', 404);
    }

    return topRecommendations;
  }
}

export default RecommendationService;
