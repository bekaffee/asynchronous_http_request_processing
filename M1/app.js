// app.js
const express = require('express');
const amqp = require('amqplib');
const winston = require('winston');

const app = express();
const QUEUE_NAME = 'task_queue';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

async function sendToQueue(task) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(task), { persistent: true });
    logger.info('Sent task to the queue:', { task });
  } catch (error) {
    logger.error('Error while sending task to queue:', { error });
  }
}

// тут получается идет обработка входящих HTTP запросов
app.get('/process', async (req, res) => {
    const task = JSON.stringify({ url: req.query.url });
    sendToQueue(task);
  
    // нам нужно подожлать пока М2 обработает задание и вернет результат
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
  
    const result = await new Promise((resolve) => {
      channel.consume(QUEUE_NAME, (message) => {
        const result = message.content.toString();
        resolve(result);
        channel.close();
      }, { noAck: true });
    });
  
    res.send(result);
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    logger.info(`Microservice M1 is listening on port ${PORT}`);
  });