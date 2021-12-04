const checkScoreUnderTen = (recommendations) => {
  return recommendations.every((r) => r.score <= 10);
};

export default checkScoreUnderTen;
