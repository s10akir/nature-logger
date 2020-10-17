"use strict";

const axios = require("axios");

const natureToken = process.env["NATURE_TOKEN"] || "";

const client = axios.create({
  baseURL: "https://api.nature.global",
  headers: {
    Authorization: `Bearer ${natureToken}`,
  },
});

client.get("/1/devices").then((res) => {
  console.log(res.data);
});
