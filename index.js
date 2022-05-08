const express = require('express')
const app = express();
const port = process.env.PORT | 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
// express middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trn0u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get('/', function (req, res) {
  res.send('Hello World')
})
// api
async function run() {
    try {
      await client.connect();
      const db = client.db("laptopDb");
      const laptopCollection = await db.collection("laptops");
      console.log("Db Connected Success");
      app.post("/add-laptop",async(req,res)=>{
          const data = req.body;
          console.log(data);
          const result = await laptopCollection.insertOne(data);
          res.send(result);
      })
      app.get("/get-laptops",async(req,res)=>{
          const cursor = laptopCollection.find({});
          res.send(await cursor.toArray())
      })
      app.get("/laptop/:id",async(req,res)=>{
        const id = ObjectId(req.params.id);
        const laptop =await laptopCollection.findOne({_id:id});
        res.send(laptop);

      })
      app.put("/update-laptop/:id",async(req,res)=>{
        const id = ObjectId(req.params.id);
        const data = req.body;
        const options = { upsert: true };
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: data,
    };
    const result = await laptopCollection.updateOne({_id:id}, updateDoc, options);
          res.send(result);
      })
      app.delete("/delete/:id",async(req,res)=>{
        const id = ObjectId(req.params.id);
        const result = await laptopCollection.deleteOne({_id:id});
        console.log(result);
    if (result.deletedCount === 1) {
      res.send(result);
    }
      })
     
      app.put("/update-quantity/:id",async(req,res)=>{
        const id = ObjectId(req.params.id);
        const findlaptop = await laptopCollection.findOne({_id:id});
        let newqt = Number(findlaptop["quantity"]);
        if(newqt > 0){
            newqt--;
        }
        const newLaptop = {
            ...findlaptop,
            quantity:newqt,
        }
        const updateDoc = {
            $set: newLaptop,
          };
          const options = { upsert: false };
          const result = await laptopCollection.updateOne({_id:id}, updateDoc, options);
          res.send(result);
        
      })
    } finally {

    }
  }

  run().catch(console.error());
app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});