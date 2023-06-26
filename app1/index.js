const express = require('express');
const kafka = require('kafka-node');
const app = express();
const sequelize = require('sequelize')


app.use(express.json());

const dbRunning =async ()=>{


const db = new sequelize(process.env.POSTGRES_URL)
const User = db.define('user',{
    name: sequelize.name,
    email: sequelize.email,
    password: sequelize.password
})
db.sync({force:true});
const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_HOST
})

const producer = new kafka.producer(client);

producer.on('ready',()=>{
    console.log('producer ready');
    app.post('/',async (req,res)=>{
        producer.send([
            {
                topic: process.env.KAFKA_TOPIC,
                messages: JSON.stringify(req.body)

            }
        ],async (err,data) =>{
            if(err)console.log(err)
            else{
                await User.create(req.body);
                res.send(req.body);
            }
        })
    });
})


}
setTimeout(dbRunning, 10000);

app.listen(process.env.PORT);