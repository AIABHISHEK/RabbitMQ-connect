const amqplib = require('amqplib');
const express = require('express');

const app = express();
const PORT = 9005;
let channel, connection;

async function connect() {
    try {
        const amqpServer = 'amqp://localhost:5672';
        connection = await amqplib.connect(amqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue('order');
    } catch (error) {
        console.log(error);
    }
}

app.post('/orders', (req, res) => {
const data = {message: 'Order placed'};
    channel.sendToQueue('order', Buffer.from(JSON.stringify({ ...data, date: new Date() })));
    res.send('Order submitted');
});

app.get('*', (req, res) => {
    res.status(404).send('Not found');
});

app.listen(PORT, () => {
    connect();
    console.log(`Server running on ${PORT}`);
});
