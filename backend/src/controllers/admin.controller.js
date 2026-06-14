export function getAdminSummary(_req, res) {
  res.json({
    data: {
      projects: 3,
      services: 6,
      messages: 0,
    },
  });
}
