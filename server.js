const express = require("express");
const bcrypt = require("bcrypt");

const users = [];
const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    let { password: pw, name } = req.body;
    const password = await bcrypt.hash(pw, 10);
    users.push({ password, name });
    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  try {
    let { password, name } = req.body;
    const user = users.find((user) => user.name === name);
    if (!user) return res.status(401).send();
    const match = await bcrypt.compare(password, user.password);
    if (match) res.status(200).send();
    else res.status(401).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.listen(3000);
