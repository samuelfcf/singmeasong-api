import RecommendationService from '../../src/services/RecommendationService.js';
import validateYoutubeLink from '../../src/utils/ValidateYoutubeLink.js';
import RecommendationRepository from '../../src/repositories/RecommendationRepository.js';
import AppError from '../../src/errors/AppError.js';

const stu = new RecommendationService();

jest.mock('../../src/utils/ValidateYoutubeLink.js');
jest.mock('../../src/repositories/RecommendationRepository.js');

describe('Recommendation Service', () => {
  const fakeNewRecommendation = {
    name: 'Test',
    youtubeLink: 'www.youtube.com'
  };

  test('New Recommendation: Should returns a new AppError - Not a youtube link', async () => {
    validateYoutubeLink.mockImplementationOnce(() => false);

    const promise = stu.newRecommendation({
      name: 'Test',
      youtubeLink: 'www.youtube.com'
    });
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('New Recommendation: Should returns a new AppError - Recommendation already exists', async () => {
    validateYoutubeLink.mockImplementationOnce(() => true);

    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findByLink: () => true
      };
    });

    const promise = stu.newRecommendation({
      name: 'Test',
      youtubeLink: 'www.youtube.com'
    });
    await expect(promise).rejects.toThrowError('Recommendation already exists');
  });

  test('New Recommendation: Should returns a new Recommendation', async () => {
    validateYoutubeLink.mockImplementationOnce(() => true);

    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findByLink: () => false,
        create: () => {
          return {
            id: 1,
            ...fakeNewRecommendation,
            score: 0
          };
        }
      };
    });

    const result = await stu.newRecommendation(fakeNewRecommendation);
    expect(result).toHaveProperty('youtubeLink');
  });

  test('Upvote: Should returns a new AppError - Recommendation does not exists', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findById: () => false
      };
    });

    const promise = stu.upvote({ id: 1 });
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('Upvote: Should upvote the recommendation', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findById: () => true,
        upvote: () => true
      };
    });

    const result = await stu.upvote({ id: 1 });
    expect(result).toBeTruthy();
  });

  test('Downvote: Should returns a new AppError - Recommendation does not exists', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findById: () => false
      };
    });

    const promise = stu.downvote({ id: 1 });
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('Downvote: Should delete recommendation if score < -5', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findById: () => {
          return {
            id: 1,
            ...fakeNewRecommendation,
            score: -6
          };
        },
        deleteById: () => null
      };
    });

    const result = await stu.downvote({ id: 1 });
    await expect(result).toEqual(null);
  });
});
