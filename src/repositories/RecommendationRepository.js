import connection from '../database/connection.js';

class RecommendationRepository {
  async create({ name, youtubeLink }) {
    const result = await connection.query(
      'INSERT INTO recommendations (name, youtube_link) VALUES ($1, $2) RETURNING *;',
      [name, youtubeLink]
    );
    return result.rows[0];
  }

  async findByLink({ youtubeLink }) {
    const result = await connection.query(
      'SELECT * FROM recommendations WHERE youtube_link = $1;',
      [youtubeLink]
    );
    return result.rows[0];
  }
}

export default RecommendationRepository;
