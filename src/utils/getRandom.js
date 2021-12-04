const getRandom = (recommendations) => {
  return recommendations[Math.floor(Math.random() * recommendations.length)];
};

export default getRandom;
