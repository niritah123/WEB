const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const createItem = async (req, res) => {
  const { title, year, rating, imdb, description } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO tbl_ex5n_ITEMS (title, year, rating, imdb, description) VALUES (?, ?, ?, ?, ?)",
      [title, year, rating, imdb, description]
    );

    const newItemId = result.insertId;

    res.status(201).json({
      message: "Item created successfully.",
      id: newItemId,
    });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Failed to create item." });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, year, rating, imdb, description } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE tbl_ex5n_ITEMS SET title = ?, year = ?, rating = ?, imdb = ?, description = ? WHERE id = ?",
      [title, year, rating, imdb, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    res.status(200).json({ message: "Item updated successfully." });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Failed to update item." });
  }
};

const getItems = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tbl_ex5n_ITEMS");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No items found." });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error retrieving items:", err);
    res.status(500).json({ error: "Failed to retrieve items." });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM tbl_ex5n_ITEMS WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found." });
    }

    res.status(200).json({ message: "Item deleted successfully." });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item." });
  }
};

module.exports = {
  createItem,
  updateItem,
  getItems,
  deleteItem,
};
