const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0hkzjzr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const serviceCollection = client.db('geniuscar').collection('car');
        const ordersCollection = client.db('geniuscar').collection('orders');

        app.get('/service',async (req,res)=>{
            const quesry = {}
            const cursor = serviceCollection.find(quesry)
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/service/:id',async (req,res)=>{
            const id = req.params.id;
            const quesry = {_id: new ObjectId(id)}
            const services = await serviceCollection.findOne(quesry)
            res.send(services)
        })

        //order api

        app.get('/order',async (req,res)=>{

            let quesry = {}
            if (req.query.email){
                quesry = {
                    email : req.query.email
                }
            }
            const services =  ordersCollection.find(quesry)
            const order = await services.toArray();
            res.send(order)
        })

        app.post('/order',async (req,res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            console.log(result)
            res.send(result)
        })

        app.delete('/order/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.send(result)
        })
        app.patch('/order/:id',async (req,res)=>{
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: new ObjectId(id)}
            const updatedDoc = {
                $set:{
                    status : status
                }
            }
            const result = await ordersCollection.updateOne(query,updatedDoc)

            res.send(result)
        })



    }finally {

    }
}

run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('genius car server is running')
})

app.listen(port, () => {
    console.log(`Genius Car server running on ${port}`);
})