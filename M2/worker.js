// worker.js
const amqp = require('amqplib');
const winston = require('winston');

const QUEUE_NAME = 'task_queue';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// тут я написал функцию для обработки таска и отправки результата в RabbitMQ очередь
async function processTask(task, channel) {
  try {
    // так как у нас задание довольно таки простое, просто имитируем обработку с таймаутом
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const result = `Processed task: ${task.url}`;
    logger.info(result);

    channel.sendToQueue(task.message.properties.replyTo, Buffer.from(result), {
      correlationId: task.message.properties.correlationId,
    });
    logger.info('Result sent to the queue:', { result });

    // тут идёт подтверждение обработки таска с правильным тегом доставки
    channel.ack(task.message);
  } catch (error) {
    logger.error('Error when processing task:', { error });
  }
}

// тут идёт коннект к RabbitMQ и запуск обработчика сообщений
async function startWorker() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', { error: err });
      process.exit(1); // когда находим ошибку всё завершаем
    });

    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.prefetch(1); // обработал месседж по одному за раз

    // это обработчик сообщении из очереди
    channel.consume(QUEUE_NAME, (message) => {
      const task = JSON.parse(message.content.toString());
      processTask({ ...task, message }, channel); // отправляем таск, месседж и канал в обработчик
    });
  } catch (error) {
    logger.error('Error when starting worker:', { error });
  }
}

startWorker();
