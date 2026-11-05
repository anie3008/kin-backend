import express from 'express';
import { MongoClient } from 'mongodb';
import 'dotenv/config'
import cors from "cors"

const app = express();
const port = 8000;

app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoClient = await connectToMongoDB();

const db = mongoClient. db("kin")
const eventCollection = db.collection('event')

app.post ('/create-event', async(req,res) => {
    const data = req.body
    const result = await eventCollection.insertOne(data)
    console.log(result);
    res.send(result)
})

app.get("/events", async (req, res) => {
  try {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    const events = await eventCollection
      .find({
        eventDate: { $gt: today },
      })
      .sort({ eventDate: 1 })
      .limit(Number(req.query.limit) || 0)
      .toArray();

    res.status(200).json(events);

  } 
catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

http://localhost:8000/events

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});