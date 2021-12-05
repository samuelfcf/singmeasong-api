const validateYoutubeLink = (youtubeLink) => {
  const rule =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return rule.test(youtubeLink);
};

const getRandom = (recommendations) => {
  return recommendations[Math.floor(Math.random() * recommendations.length)];
};

const checkScoreUnderTen = (recommendations) => {
  return recommendations.every((r) => r.score <= 10);
};

const checkScoreOverTen = (recommendations) => {
  return recommendations.every((r) => r.score > 10);
};

const calculateProbability = () => {
  return Math.floor(Math.random() * 10 + 1) <= 7;
};

export {
  validateYoutubeLink,
  getRandom,
  checkScoreUnderTen,
  checkScoreOverTen,
  calculateProbability
};
