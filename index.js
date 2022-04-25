const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


// middleware 
app.use(cors());
app.use(express.json());

// bla bla bla

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.evij0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");
        const orderCollection = client.db("geniusCar").collection("order");
        
        // AUTH JWT
        app.post("/login", async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
            res.send({accessToken});
        })



        // SERVICES API
        // get all services
        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // get single service
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // add service
        app.post("/service", async (req, res) => {
            const newService = req.body;
            console.log(newService);
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // Delete service 
        app.delete("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })



        // Order collection api
        app.get("/order", async (req, res) => {
            const query = req.query;
            console.log(query);
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Running Genius Serverrr");
})

app.listen(port, () => {
    console.log('Listening to genius server, port', port);
})