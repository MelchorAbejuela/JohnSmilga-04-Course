const ProductSchema = require("../models/product");

const getAllProductsStatic = async (req, res, next) => {
  const search = "";
  try {
    const products = await ProductSchema.find({
      name: { $regex: search, $options: "i" },
    })
      .sort("name")
      .select("name price rating");

    res.status(200).json({ products, nbHits: products.length });
  } catch (error) {
    next(error);
  }
};

// done
const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, attribute, numericalFilters } =
    req.query;
  let queryObject = {};

  // search base on objects property or key
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  // search base on objects property or key
  if (company) {
    queryObject.company = { $regex: company, $options: "i" };
  }

  // search base on objects property or key
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // filter base on user choice of object property or key
  let modifiedSort;
  if (sort) {
    modifiedSort = sort.split(",").join(" ");
  }

  // choose the attribute or key to show
  let selectAttributes;
  if (attribute) {
    selectAttributes = attribute.split(",").join(" ");
    console.log(attribute);
  }

  // filter using regEx
  // check if numericalFilters params is a truthy value
  if (numericalFilters) {
    // if truthy value then create operatorMap that includes all operators
    const operatorMap = {
      ">": "gt",
      ">=": "gte",
      "=": "eq",
      "<": "lt",
      "<=": "lte",
    };

    // regEx will be use for comparison
    // \b is used for the symbol treated as seperate character (example: price>=100)
    // /g is used for find all occurences of these symbol
    const regEx = /\b(>|>=|=|<=|<)\b/g;
    let filters = numericalFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    filters = filters.split(",").join(" ");

    queryObject.numericalFilters = filters;
  }

  console.log(queryObject);

  // get the querys in the url
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  // show a list of items base on condition (page and limit)
  const skip = (page - 1) * limit;

  // sort the response base on all sorting criteria above
  const products = await ProductSchema.find(queryObject)
    .sort(modifiedSort || "name")
    .select(selectAttributes)
    .limit(limit)
    .skip(skip);

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
