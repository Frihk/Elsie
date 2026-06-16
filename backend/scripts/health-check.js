const port = process.env.PORT || 5000;
const url = `http://localhost:${port}/api/health`;

const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Health check failed with status ${response.status}`);
}

const payload = await response.json();
console.log(payload);
