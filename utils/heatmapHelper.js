exports.getIntensityColor = (count) => {
  const intensity = Math.min(255, 50 + count * 40);
  return `rgb(0, ${intensity}, 150)`;
};

exports.getSkillStats = (skills) => {
  return skills.map(s => ({
    ...s,
    intensity: Math.min(255, 50 + s.count * 40)
  }));
};
