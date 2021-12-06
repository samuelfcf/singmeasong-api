import faker from 'faker';
import RecommendationRepository from '../../src/repositories/RecommendationRepository.js';

const recommendationRepository = new RecommendationRepository();

const fakeRecommendation = {
  name: faker.datatype.string(),
  youtubeLink: 'https://www.youtube.com/watch?v=5NsBJ9wWoLo'
};

const fakeRecommendationToBeDeleted = [
  faker.datatype.string(),
  'https://www.youtube.com/watch?v=5NsBJ9wWoLo',
  -5
];

const invalidRecommendation = {
  name: faker.datatype.number()
};

const createRecommendation = async () => {
  const recommendation = recommendationRepository.create(fakeRecommendation);
  return recommendation;
};

const createRecommendationToBeDeleted = async () => {
  const recommendation = recommendationRepository.toBeDeleted(
    fakeRecommendationToBeDeleted
  );
  return recommendation;
};

const deleteRecommendations = async () => recommendationRepository.delete();

export {
  fakeRecommendation,
  invalidRecommendation,
  createRecommendation,
  createRecommendationToBeDeleted,
  deleteRecommendations
};
