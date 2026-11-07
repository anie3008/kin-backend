import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
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
const joinedEventCollection = db.collection('joinedEvent')

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

app.get('/events/:id', async(req, res) => {
    const {id} = req.params
    const result = await eventCollection.findOne({_id: new ObjectId(id)})

    res.send(result)
})
app.get('/my-events',async(req, res) => {
  const email = req.params.email;
  const result = await eventCollection.find({email: email}).toArray();
  res.send(result)
})

app.post('/joined-event', async(req, res) => {
  const data = req.body
  const result = await joinedEventCollection.insertOne(data)
  res.send(result)
})

app.get('/joined-events/:email', async(req, res) => {
  const {email} = req.params
  const result = await joinedEventCollection.find({email:email}). toArray()
    res.send(result)
  console.log(result);
})

app.get("/my-events/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const result = await eventCollection
            .find({ creatorEmail: email })
            .toArray();

        res.send(result);
    } catch (error) {
        res.status(500).send({
            message: "Failed to fetch my events"
        });
    }
});

app.patch('/edit-event/:id', async(req,res) =>{
  const {id} = req.params
  const data = req.body
  const result = await eventCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set:data}
  )
  res.send(result)
})

app.delete("/delete-event/:id", async (req, res) => {
  const result = await eventCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.send(result);
});

http://localhost:8000/update-event/${id}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});