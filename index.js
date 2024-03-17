const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const filePath = "./data/db.json";

// Endpoint untuk mendapatkan semua data blog
app.get("/blogs", async (req, res) => {
  try {
    const data = await fs.readFile(filePath);
    const jsonData = JSON.parse(data);
    res.json(jsonData.blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menambahkan blog baru
app.post("/blogs", async (req, res) => {
  try {
    const data = await fs.readFile(filePath);
    const jsonData = JSON.parse(data);
    const newBlog = req.body; // Ambil data blog dari body permintaan POST
    jsonData.blogs.push(newBlog); // Tambahkan blog baru ke array blogs
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2)); // Tulis kembali data ke file
    res.status(201).json(newBlog); // Kirim respons dengan blog yang baru ditambahkan
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
