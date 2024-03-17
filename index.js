const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const filePath = "./data/db.json";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

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

// Endpoint untuk mendapatkan detail blog berdasarkan ID
app.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await fs.readFile(filePath);
    const jsonData = JSON.parse(data);
    const blog = jsonData.blogs.find((blog) => blog.id === id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk mengupdate blog berdasarkan id
app.put("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await fs.readFile(filePath);
    let jsonData = JSON.parse(data);
    const index = jsonData.blogs.findIndex((blog) => blog.id === id);
    if (index !== -1) {
      const updatedBlog = req.body;
      jsonData.blogs[index] = { ...jsonData.blogs[index], ...updatedBlog };
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      res.json(jsonData.blogs[index]);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menghapus blog berdasarkan id
app.delete("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await fs.readFile(filePath);
    let jsonData = JSON.parse(data);
    const index = jsonData.blogs.findIndex((blog) => blog.id === id);
    if (index !== -1) {
      jsonData.blogs.splice(index, 1);
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
      res.status(204).end(); // No Content
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
