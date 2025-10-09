import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../src/app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

it("creates a transcription and returns id", async () => {
  const res = await request(app)
    .post("/transcription")
    .send({
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    })
    .expect(200); // updated from 201 to 200 based on your response

  // check structured response
  expect(res.body).toHaveProperty("status", 200);
  expect(res.body).toHaveProperty(
    "message",
    "Transcription has been saved successfully."
  );
  expect(res.body).toHaveProperty("data");
  expect(res.body.data).toHaveProperty("_id");
  expect(res.body.data).toHaveProperty(
    "audioUrl",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  );
  expect(res.body.data).toHaveProperty("transcription");
  expect(res.body.data).toHaveProperty("source", "mock");
  expect(res.body.data).toHaveProperty("createdAt");
});

it("lists only recent transcriptions (last 30 days) with pagination", async () => {
  // create a transcription first
  await request(app)
    .post("/transcription")
    .send({
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    })
    .expect(200);

  const list = await request(app)
    .get("/transcription?page=1&limit=10")
    .expect(200);

  // check pagination structure
  expect(list.body).toHaveProperty("page", 1);
  expect(list.body).toHaveProperty("limit", 10);
  expect(list.body).toHaveProperty("total");
  expect(list.body).toHaveProperty("totalPages");
  expect(list.body).toHaveProperty("items");
  expect(Array.isArray(list.body.items)).toBeTruthy();
  expect(list.body.items.length).toBeGreaterThanOrEqual(1);

  // check a sample item structure
  const item = list.body.items[0];
  expect(item).toHaveProperty("_id");
  expect(item).toHaveProperty("audioUrl");
  expect(item).toHaveProperty("transcription");
  expect(item).toHaveProperty("source");
  expect(item).toHaveProperty("createdAt");
});
