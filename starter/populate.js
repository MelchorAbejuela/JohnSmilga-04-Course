require("dotenv").config();

const connectDB = require("./db/connect");
const ProductSchema = require("./models/product");

const jsonProducts = require("./products.json");

// this example calls the create methods in each product because it loops which is inefficient
// const addToDB = () => {
//   jsonProducts.map(async (product) => {
//     await ProductSchema.create(product);
//   });
// };

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await ProductSchema.deleteMany();
    await ProductSchema.create(jsonProducts);
    console.log("sucess");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
