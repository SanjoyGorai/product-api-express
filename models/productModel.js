import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { nanoid } from "nanoid";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: nanoid,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Product;
