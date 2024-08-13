const express = require("express");
const cors = require("cors");

require("dotenv").config();

const dataRouter = require("./routes/data");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API.");
});

app.use("/api", dataRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
