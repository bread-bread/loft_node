// Не понял зачем в этом задании использовать переменные окружения? ¯\_(ツ)_/¯
process.env.INTERVAL = 1000;
process.env.DURATION = 5000;

const PORT = 8888;
const HOST = 'localhost';
const INTERVAL = process.env.INTERVAL;
const DURATION = process.env.DURATION;

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  if (req.url === '/') {
    const intervalId = setInterval(() => {
      console.log(new Date().toUTCString());
    }, INTERVAL);

    setTimeout(() => {
      clearInterval(intervalId);
      res.write(new Date().toUTCString());
      res.end();
    }, DURATION);
  }
});

server.listen(PORT, HOST, () => {
  console.log('Server running at port:', PORT);
});
