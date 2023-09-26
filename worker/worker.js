const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672');
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

const receiveMessageFromQueue = async (queueName) => {
    const channel = await connectToRabbitMQ();

    channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (message) => {
        const content = message.content.toString();
        //perform operations on the message
        console.log(`Received message: ${content}`);
        channel.ack(message);
    });
};

const queueName = 'order'; // Replace with your queue name
receiveMessageFromQueue(queueName);
