import RecommendationService from '../../src/services/RecommendationService.js';
import validateYoutubeLink from '../../src/utils/validateYoutubeLink.js';
import getRandom from '../../src/utils/getRandom.js';
import calculateProbability from '../../src/utils/calculateProbability.js';
import checkScoreOverTen from '../../src/utils/checkScoreOverTen.js';
import checkScoreUnderTen from '../../src/utils/checkScoreUnderTen.js';
import RecommendationRepository from '../../src/repositories/RecommendationRepository.js';
import AppError from '../../src/errors/AppError.js';

const stu = new RecommendationService();

jest.mock('../../src/utils/validateYoutubeLink.js');
jest.mock('../../src/utils/getRandom.js');
jest.mock('../../src/utils/checkScoreOverTen.js');
jest.mock('../../src/utils/checkScoreUnderTen.js');
jest.mock('../../src/utils/calculateProbability.js');
jest.mock('../../src/repositories/RecommendationRepository.js');

describe('Recommendation Service', () => {
  const fakeNewRecommendation = {
    name: 'Test',
    youtubeLink: 'www.youtube.com'
  };

  test('New Recommendation: Should returns a new AppError - Not a youtube link', async () => {
    validateYoutubeLink.mockImplementationOnce(() => false);

    const promise = stu.newRecommendation(fakeNewRecommendation);
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('New Recommendation: Should returns a new AppError - Recommendation already exists', async () => {
    validateYoutubeLink.mockImplementationOnce(() => true);

    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findByLink: () => true
      };
    });

    const promise = stu.newRecommendation(fakeNewRecommendation);
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

  test('Upvote: Should upvote the recommendation if score >= -5', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findById: () => {
          return {
            id: 1,
            ...fakeNewRecommendation,
            score: -5
          };
        },
        upvote: () => {
          return {
            id: 1,
            ...fakeNewRecommendation,
            score: -4
          };
        }
      };
    });

    const result = await stu.upvote({ id: 1 });
    expect(result.score).toBe(-4);
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

  test('Downvote: Should downvote the recommendation if score >= -5', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findById: () => {
          return {
            id: 1,
            ...fakeNewRecommendation,
            score: 0
          };
        },
        downvote: () => {
          return {
            id: 1,
            ...fakeNewRecommendation,
            score: -1
          };
        }
      };
    });

    const result = await stu.downvote({ id: 1 });
    await expect(result.score).toBe(-1);
  });

  test('Get Random Recommendation: Should returns a new AppError - No recommendations yet', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findAll: () => undefined
      };
    });

    const promise = stu.getRandomRecommendation();
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('Get Random Recommendation: Should returns random recommendation with any score if only has musics with score > 10', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findAll: () => true
      };
    });

    checkScoreOverTen.mockImplementationOnce(() => true);
    checkScoreUnderTen.mockImplementationOnce(() => false);
    getRandom.mockImplementationOnce(() => {
      return {
        id: 12,
        ...fakeNewRecommendation,
        score: 112
      };
    });

    const result = await stu.getRandomRecommendation();
    expect(result).toHaveProperty('score');
  });

  test('Get Random Recommendation: Should returns random recommendation with any score if only has musics with score <= 10', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findAll: () => true
      };
    });

    checkScoreOverTen.mockImplementationOnce(() => false);
    checkScoreUnderTen.mockImplementationOnce(() => true);
    getRandom.mockImplementationOnce(() => {
      return {
        id: 12,
        ...fakeNewRecommendation,
        score: 5
      };
    });

    const result = await stu.getRandomRecommendation();
    expect(result).toHaveProperty('score');
  });

  test('Get Random Recommendation: Should returns songs with scores over 10 70% of the time', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findAll: () => true,
        findScoreOverTen: () => {
          return [
            {
              id: 12,
              ...fakeNewRecommendation,
              score: 112
            },
            {
              id: 13,
              ...fakeNewRecommendation,
              score: 95
            }
          ];
        }
      };
    });

    checkScoreOverTen.mockImplementationOnce(() => false);
    checkScoreUnderTen.mockImplementationOnce(() => false);
    calculateProbability.mockImplementationOnce(() => true);
    getRandom.mockImplementationOnce(() => {
      return {
        id: 13,
        ...fakeNewRecommendation,
        score: 95
      };
    });

    const result = await stu.getRandomRecommendation();
    expect(result).toHaveProperty('score');
    expect(result.score).toBeGreaterThan(10);
  });

  test('Get Random Recommendation: Should returns songs with scores under 10 30% of the time', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findAll: () => true,
        findScoreUnderTen: () => {
          return [
            {
              id: 12,
              ...fakeNewRecommendation,
              score: -3
            },
            {
              id: 13,
              ...fakeNewRecommendation,
              score: 7
            }
          ];
        }
      };
    });

    checkScoreOverTen.mockImplementationOnce(() => false);
    checkScoreUnderTen.mockImplementationOnce(() => false);
    calculateProbability.mockImplementationOnce(() => false);
    getRandom.mockImplementationOnce(() => {
      return {
        id: 13,
        ...fakeNewRecommendation,
        score: 7
      };
    });

    const result = await stu.getRandomRecommendation();
    expect(result).toHaveProperty('score');
    expect(result.score).toBeLessThanOrEqual(10);
  });
});
