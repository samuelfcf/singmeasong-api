const validateYoutubeLink = (youtubeLink) => {
  const rule =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return rule.test(youtubeLink);
};

export default validateYoutubeLink;
