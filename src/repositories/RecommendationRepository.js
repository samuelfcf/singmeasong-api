import connection from '../database/connection.js';

class RecommendationRepository {
  async create({ name, youtubeLink }) {
    const result = await connection.query(
      'INSERT INTO recommendations (name, youtube_link) VALUES ($1, $2) RETURNING *;',
      [name, youtubeLink]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await connection.query('SELECT * FROM recommendations;');
    if (result.rows.length === 0) return null;
  }

  async findByLink({ youtubeLink }) {
    const result = await connection.query(
      'SELECT * FROM recommendations WHERE youtube_link = $1;',
      [youtubeLink]
    );
    return result.rows[0];
  }

  async findById({ id }) {
    const result = await connection.query(
      'SELECT * FROM recommendations WHERE id = $1;',
      [id]
    );
    return result.rows[0];
  }

  async findScoreOverTen() {
    const result = await connection.query(
      'SELECT * FROM recommendations WHERE score>10;'
    );
    return result.rows;
  }

  async findScoreUnderTen() {
    const result = await connection.query(
      'SELECT * FROM recommendations WHERE score>-5 AND score<=10;'
    );
    return result.rows;
  }

  async findTops({ limit }) {
    let query = 'SELECT * FROM recommendations ORDER BY score DESC';
    const preparedValues = [];
    if (limit) {
      preparedValues.push(limit);
      query += ` LIMIT $${preparedValues.length};`;
    }

    const result = await connection.query(query, preparedValues);
    return result.rows;
  }

  async upvote({ id }) {
    const result = await connection.query(
      'UPDATE recommendations SET score = score + 1 WHERE id = $1 RETURNING *;',
      [id]
    );
    return result.rows[0];
  }

  async downvote({ id }) {
    const result = await connection.query(
      'UPDATE recommendations SET score = score - 1 WHERE id = $1 RETURNING *;',
      [id]
    );
    return result.rows[0];
  }

  async deleteById({ id }) {
    await connection.query(
      'DELETE FROM recommendations WHERE id = $1 RETURNING *;',
      [id]
    );
    return null;
  }

  async delete() {
    await connection.query('DELETE FROM recommendations;');
  }

  async toBeDeleted(fakeData) {
    const result = await connection.query(
      'INSERT INTO recommendations (name, youtube_link, score) VALUES ($1,$2,$3) RETURNING *;',
      fakeData
    );
    return result.rows[0];
  }
}

export default RecommendationRepository;
