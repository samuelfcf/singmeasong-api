const checkScoreOverTen = (recommendations) => {
  return recommendations.every((r) => r.score > 10);
};

export default checkScoreOverTen;
