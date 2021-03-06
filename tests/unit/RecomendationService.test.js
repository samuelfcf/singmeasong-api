import RecommendationService from '../../src/services/RecommendationService.js';
import * as Functions from '../../src/utils/functions.js';
import RecommendationRepository from '../../src/repositories/RecommendationRepository.js';
import AppError from '../../src/errors/AppError.js';

const stu = new RecommendationService();

jest.mock('../../src/utils/functions.js');
jest.mock('../../src/repositories/RecommendationRepository.js');

describe('Recommendation Service', () => {
  const fakeNewRecommendation = {
    name: 'Test',
    youtubeLink: 'www.youtube.com'
  };

  test('New Recommendation: Should returns a new AppError - Not a youtube link', async () => {
    Functions.validateYoutubeLink.mockImplementationOnce(() => false);

    const promise = stu.newRecommendation(fakeNewRecommendation);
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('New Recommendation: Should returns a new AppError - Recommendation already exists', async () => {
    Functions.validateYoutubeLink.mockImplementationOnce(() => true);

    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findByLink: () => true
      };
    });

    const promise = stu.newRecommendation(fakeNewRecommendation);
    await expect(promise).rejects.toThrowError('Recommendation already exists');
  });

  test('New Recommendation: Should returns a new Recommendation', async () => {
    Functions.validateYoutubeLink.mockImplementationOnce(() => true);

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

    Functions.checkScoreOverTen.mockImplementationOnce(() => true);
    Functions.checkScoreUnderTen.mockImplementationOnce(() => false);
    Functions.getRandom.mockImplementationOnce(() => {
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

    Functions.checkScoreOverTen.mockImplementationOnce(() => false);
    Functions.checkScoreUnderTen.mockImplementationOnce(() => true);
    Functions.getRandom.mockImplementationOnce(() => {
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

    Functions.checkScoreOverTen.mockImplementationOnce(() => false);
    Functions.checkScoreUnderTen.mockImplementationOnce(() => false);
    Functions.calculateProbability.mockImplementationOnce(() => true);
    Functions.getRandom.mockImplementationOnce(() => {
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

    Functions.checkScoreOverTen.mockImplementationOnce(() => false);
    Functions.checkScoreUnderTen.mockImplementationOnce(() => false);
    Functions.calculateProbability.mockImplementationOnce(() => false);
    Functions.getRandom.mockImplementationOnce(() => {
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

  test('Get Top Recommendatations: Should returns a new AppError if amount is > 0 and there is no recommendations', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findTops: () => []
      };
    });

    const promise = stu.getTopRecommendations({ amount: 2 });
    await expect(promise).rejects.toThrowError(AppError);
  });

  test('Get Top Recommendatations: Should returns no recommendations if limit = 0', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findTops: () => []
      };
    });

    const result = await stu.getTopRecommendations({ amount: 0 });
    await expect(result.length).toBe(0);
  });

  test('Get Top Recommendatations: Should returns top (limit) recommendations if limit > 0', async () => {
    RecommendationRepository.mockImplementationOnce(() => {
      return {
        findTops: () => [
          {
            id: 1,
            ...fakeNewRecommendation,
            score: 30
          },
          {
            id: 2,
            ...fakeNewRecommendation,
            score: 20
          }
        ]
      };
    });

    const result = await stu.getTopRecommendations({ amount: 2 });
    await expect(result.length).toBe(2);
  });
});
