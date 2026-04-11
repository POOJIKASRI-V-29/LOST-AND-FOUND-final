// ─── Lost & Found — Express + MongoDB Backend ────────────────
// 1. Copy this file to your project root (next to package.json)
// 2. npm install express mongodb cors dotenv
// 3. node server.js

require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app       = express();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const PORT      = process.env.PORT      || 3001;

app.use(cors());
app.use(express.json());

const SEED_ITEMS = [
  { id: 1, type: "lost",  title: "Blue Leather Wallet",    category: "Accessories", location: "Central Park, NYC",    date: "2026-03-20", description: "Navy blue leather wallet with initials 'JD'. Contains ID cards and family photos.", image: "👜", status: "active", lat: 40.7851, lng: -73.9683, contact: "john@email.com"   },
  { id: 2, type: "found", title: "iPhone 15 Pro (Black)",  category: "Electronics", location: "Times Square Station", date: "2026-03-22", description: "Black iPhone 15 Pro found near the subway exit. Has a cracked screen protector.",   image: "📱", status: "active", lat: 40.7580, lng: -73.9855, contact: "sarah@email.com"  },
  { id: 3, type: "lost",  title: "Golden Retriever - Max", category: "Pets",        location: "Brooklyn Bridge",       date: "2026-03-23", description: "Male golden retriever, 3 years old, wearing a red collar with tag 'Max'.",       image: "🐕", status: "active", lat: 40.7061, lng: -73.9969, contact: "mike@email.com"   },
  { id: 4, type: "found", title: "Car Keys with Fob",      category: "Keys",        location: "Grand Central Station", date: "2026-03-24", description: "Toyota car keys with a blue keychain bear. Found near ticket booth.",            image: "🔑", status: "active", lat: 40.7527, lng: -73.9772, contact: "anna@email.com"   },
  { id: 5, type: "lost",  title: "MacBook Pro 14-inch",    category: "Electronics", location: "Brooklyn Coffee Shop",  date: "2026-03-25", description: "Silver MacBook Pro with stickers on back. Has a dent on corner.",               image: "💻", status: "active", lat: 40.6892, lng: -73.9442, contact: "dev@email.com"    },
  { id: 6, type: "found", title: "Black Backpack",         category: "Bags",        location: "Central Park South",   date: "2026-03-21", description: "Large black backpack with books and gym clothes inside. No ID found.",          image: "🎒", status: "active", lat: 40.7641, lng: -73.9736, contact: "finder@email.com" },
];

async function start() {
  const client = await MongoClient.connect(MONGO_URI);
  const db     = client.db("lostandfound");
  const col    = db.collection("items");
  console.log("✅ Connected to MongoDB");

  if ((await col.countDocuments()) === 0) {
    await col.insertMany(SEED_ITEMS.map(item => ({ ...item, createdAt: new Date() })));
    console.log("🌱 Seeded 6 sample items");
  }

  app.get("/api/items", async (req, res) => {
    try {
      const items = await col.find().sort({ createdAt: -1 }).toArray();
      res.json(items.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() })));
    } catch { res.status(500).json({ error: "Failed to fetch items" }); }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const { title, type, location, contact } = req.body;
      if (!title || !type || !location || !contact)
        return res.status(400).json({ error: "title, type, location and contact are required" });
      const doc = {
        title, type,
        category:    req.body.category    || "Other",
        location,
        date:        req.body.date        || new Date().toISOString().split("T")[0],
        description: req.body.description || "",
        contact,
        image:       req.body.image       || (type === "lost" ? "🔍" : "✅"),
        status:      req.body.status      || "active",
        lat:         req.body.lat         || null,
        lng:         req.body.lng         || null,
        createdAt:   new Date(),
      };
      const result = await col.insertOne(doc);
      res.status(201).json({ ...doc, id: result.insertedId.toString() });
    } catch { res.status(500).json({ error: "Failed to create item" }); }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });
      await col.updateOne({ _id: new ObjectId(id) }, { $set: { status: req.body.status, updatedAt: new Date() } });
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to update item" }); }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });
      await col.deleteOne({ _id: new ObjectId(id) });
      res.json({ success: true });
    } catch { res.status(500).json({ error: "Failed to delete item" }); }
  });

  app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`));
}

start().catch(err => { console.error("❌ Startup failed:", err.message); process.exit(1); });
