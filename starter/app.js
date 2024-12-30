require("dotenv").config();

const express = require("express");
const app = express();

// initialization of middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");

// routes
app.get("/", (req, res) => {
  res.send(
    '<h1>This is a Store API.</h1><a href="/api/v1/products">products route</a>'
  );
});

// initalize the routes
const routes = require("./routes/products");
app.use("/api/v1/products", routes);

// products route

// if routes does not exist
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
