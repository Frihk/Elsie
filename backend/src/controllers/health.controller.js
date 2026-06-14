export function getHealth(_req, res) {
  res.json({
    data: {
      service: 'elsie-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
