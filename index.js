const express = require("express");
const fs = require("fs/promises");
const port = 8000;

const app = express();

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

// Endpoint untuk menambahkan blog baru
app.post("/blogs", async (req, res) => {
  try {
    const data = await fs.readFile(filePath);
    let jsonData = JSON.parse(data);

    // Mendapatkan data blog baru dari body request
    const newBlog = req.body;

    // Mendapatkan ID terakhir dari array blogs untuk menentukan ID baru
    const lastBlog = jsonData.blogs[jsonData.blogs.length - 1];
    const newId = lastBlog ? lastBlog.id + 1 : 1;

    // Menambahkan ID ke blog baru
    newBlog.id = newId;

    // Menambahkan blog baru ke dalam array blogs
    jsonData.blogs.push(newBlog);

    // Menulis kembali data JSON ke file
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    // Mengirimkan respons dengan data blog baru yang ditambahkan
    res.status(201).json(newBlog);
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
