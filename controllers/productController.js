import Product from "../models/productModel.js";
import s3 from "../config/s3.js";
import fs from "fs";

export const createProduct = async (req, res) => {
  try {
    // Upload images to S3
    const s3Urls = await Promise.all(
      req.files.map(async (file) => {
        const fileContent = fs.readFileSync(file.path);
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file.filename,
          Body: fileContent,
          ContentType: file.mimetype,
        };
        const data = await s3.upload(params).promise();
        return data.Location;
      })
    );

    // Save product to database
    const product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      images: s3Urls,
    });

    // Delete images from the Express server after 2 minutes
    setTimeout(() => {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }, 120000);

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product by ID
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product details
    await product.update({ title, price, description });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the product
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all products
export const deleteAllProducts = async (req, res) => {
  try {
    await Product.destroy({ where: {}, truncate: true });

    res.status(200).json({ message: "All products deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
