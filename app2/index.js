const express = require('express');
const kafka = require('kafka-node');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config()

app.use(express.json());

const dbRunning = async ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    const User = new mongoose.model('user',{
        name: String,
        email: String,
        password: String
    })
    const client = new kafka.KafkaClient({
        kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS
    })
    const consumer = new kafka.Consumer(client,[{
        topic: process.env.KAFKA_TOPIC

    }],{
        autoCommit: false
    });
    consumer.on('message',async(message) =>{
        const user= await new User(JSON.parse(message.value));
        await user.save();
    })
    consumer.on('error',(err)=>{
        console.log(err)
    })
    
}
setTimeout(dbRunning, 10000);
app.listen(process.env.PORT);