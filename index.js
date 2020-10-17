"use strict";

const axios = require("axios");
const { MongoClient } = require("mongodb");

const natureToken = process.env["NATURE_TOKEN"] || "";
const mongoURL = process.env["MONGO_URL"] || "";

const httpClient = axios.create({
  baseURL: "https://api.nature.global",
  headers: {
    Authorization: `Bearer ${natureToken}`,
  },
});

const mongoClient = new MongoClient(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoClient.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const db = mongoClient.db("nature-remo");

  httpClient.get("/1/devices").then((res) => {
    res.data.forEach((device) => {
      const collection = db.collection(device.name);
      collection.insertOne(device, () => {
        // FIXME: 複数デバイス存在する場合は1デバイス目でcloseしてしまうと後ろがコケる
        //        これらの非同期処理を待機してから最後にcloseする仕組みが必要
        mongoClient.close();
      });
    });
  });
});
