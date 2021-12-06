import supertest from 'supertest';
import app from '../../src/app.js';
import connection from '../../src/database/connection.js';
import * as Factory from '../factories/recommendations.factory.js';
import { httpStatus } from '../../src/utils/constants.js';

afterAll(async () => {
  await Factory.deleteRecommendations();
  connection.end();
});

describe('POST /recommendations', () => {
  beforeAll(async () => {
    await Factory.createRecommendation();
  });

  afterEach(async () => {
    await Factory.deleteRecommendations();
  });

  test('should returns 409 for recommendation already exists', async () => {
    const result = await supertest(app)
      .post('/recommendations')
      .send(Factory.fakeRecommendation);

    expect(result.status).toEqual(httpStatus.CONFLICT);
  });

  test('should returns 201 for created new recommendation', async () => {
    const result = await supertest(app)
      .post('/recommendations')
      .send(Factory.fakeRecommendation);

    expect(result.status).toEqual(httpStatus.CREATED);
    expect(result.body.data).toHaveProperty('id');
  });

  test('should returns 400 for invalid body', async () => {
    const result = await supertest(app)
      .post('/recommendations')
      .send(Factory.invalidRecommendation);

    expect(result.status).toEqual(httpStatus.BAD_REQUEST);
  });
});

describe('POST /recommendations/:id/upvote', () => {
  afterAll(async () => {
    await Factory.deleteRecommendations();
  });

  test('should returns 500 for invalid id type', async () => {
    const invalidId = 'Invalid';

    const result = await supertest(app).post(
      `/recommendations/${invalidId}/upvote`
    );
    expect(result.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should returns 404 for recommendation does not exists', async () => {
    const wrongId = 1;

    const result = await supertest(app).post(
      `/recommendations/${wrongId}/upvote`
    );
    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });

  test('should returns 200 for upvote success', async () => {
    const recommendation = await Factory.createRecommendation();

    const result = await supertest(app).post(
      `/recommendations/${recommendation.id}/upvote`
    );
    expect(result.status).toEqual(httpStatus.SUCCESS);
    expect(result.body.data).toHaveProperty('score');
  });
});

describe('POST /recommendations/:id/downvote', () => {
  afterAll(async () => {
    await Factory.deleteRecommendations();
  });

  test('should returns 500 for invalid id type', async () => {
    const invalidId = 'Invalid';

    const result = await supertest(app).post(
      `/recommendations/${invalidId}/downvote`
    );
    expect(result.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should returns 404 for recommendation does not exists', async () => {
    const wrongId = 1;

    const result = await supertest(app).post(
      `/recommendations/${wrongId}/downvote`
    );
    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });

  test('should returns 200 for downvote success', async () => {
    const recommendation = await Factory.createRecommendation();

    const result = await supertest(app).post(
      `/recommendations/${recommendation.id}/downvote`
    );
    expect(result.status).toEqual(httpStatus.SUCCESS);
    expect(result.body.data).toHaveProperty('score');
  });

  test('should returns 200 delete recommendation if score < -5', async () => {
    const recommendation = await Factory.createRecommendationToBeDeleted();

    const result = await supertest(app).post(
      `/recommendations/${recommendation.id}/downvote`
    );
    expect(result.status).toEqual(httpStatus.SUCCESS);
    expect(result.body.data).toBeNull();
  });
});

describe('GET /recommendations/random', () => {
  beforeEach(async () => {
    await Factory.createRecommendation();
  });

  test('should returns 404 for no recommendations yet', async () => {
    const result = await supertest(app).get('/recommendations/random');
    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });
});

describe('GET /recommendations/top/:amount', () => {
  beforeAll(async () => {
    await Factory.deleteRecommendations();
  });

  test('should returns 500 for invalid amount type', async () => {
    const invalidAmount = 'Invalid';
    const result = await supertest(app).get(
      `/recommendations/top/${invalidAmount}`
    );
    expect(result.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should returns 404 for no recommendations yet', async () => {
    const amount = 3;
    const result = await supertest(app).get(`/recommendations/top/${amount}`);

    expect(result.status).toEqual(httpStatus.NOT_FOUND);
  });
});
