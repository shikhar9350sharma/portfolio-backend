// import express from 'express';
// import bodyParser from 'body-parser';
// import { MongoClient } from 'mongodb';


// const app = express();
// const port = 3000;

// app.use(bodyParser.json()); // Middleware to parse JSON

// const url = "mongodb://localhost:27017";
// const client = new MongoClient(url) //for create a client instance
// const dbName = "portfolio"  //database

// async function connectDB() {
//     try {
//         await client.connect() // Establish connection
//         const db = client.db(dbName) // Access the 'portfilio' database
//         const collection = db.collection('messages');

//         //this is the code for the insertion of data
//         app.get('/', (req, res) => {
//             res.send('Welcome to MongodbAtlas!');
//         });
//         app.post('/', async (req, res) => {
//             const { username, email, message } = req.body;
//             if (!username || !email || !message) {
//                 return res.status(400).json({ message: "All the fields are required!" });
//             }
//             const result = await collection.insertOne(
//                 {
//                     username,
//                     email, 
//                     message, 
//                     Timestamp: new Date()

//                 })
//             return res.status(200).json({ message: "Message delivered successfully" });
//         });

//     } catch (error) {
//         console.error('Connection error:', error);
//     }
// }


// app.listen(port, async () => {
//     await connectDB();
//     console.log(`Example app listening on http://localhost:${port}`);
// });
import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import cors from 'cors'

const app = express();
const port = 3000;
dotenv.config()
app.use(cors({
  origin: "https://portfolio-chi-red-69.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options('*', cors());
app.use(express.json()); // Modern way to parse JSON

const url =  process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = "portfolio";

let collection; // Declare globally

// async function connectDB() {
//   try {
//     await client.connect();
//     const db = client.db(dbName);
//     collection = db.collection('messages');
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error('Connection error:', error);
//   }
// }


// // Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to MongodbAtlas!');
// });

// app.post('/', async (req, res) => {
//   const { username, email, message } = req.body;
//   if (!username || !email || !message) {
//     return res.status(400).json({ message: "All the fields are required!" });
//   }

//   try {
//     const result = await collection.insertOne({
//       username,
//       email,
//       message,
//       timestamp: new Date()
//     });
//     return res.status(200).json({ message: "Message delivered successfully", id: result.insertedId });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to save message", error: error.message });
//   }
// });

// app.listen(port, async () => {
//   await connectDB();
//   console.log(`Example app listening on http://localhost:${port}`);
// });
async function connectDBAndStartServer() {
  try {
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection('messages');
    console.log("Connected to MongoDB");

    // Define routes only after DB is ready
    app.get('/', (req, res) => {
      res.send('Welcome to MongodbAtlas!');
    });

    app.post('/', async (req, res) => {
      const { username, email, message } = req.body;
      if (!username || !email || !message) {
        return res.status(400).json({ message: "All the fields are required!" });
      }

      try {
        const result = await collection.insertOne({
          username,
          email,
          message,
          timestamp: new Date()
        });
        return res.status(200).json({ message: "Message delivered successfully", id: result.insertedId });
      } catch (error) {
        return res.status(500).json({ message: "Failed to save message", error: error.message });
      }
    });

    app.listen(port, () => {
      console.log(`Example app listening on http://localhost:${port}`);
    });

  } catch (error) {
    console.error('Connection error:', error);
  }
}

connectDBAndStartServer();
