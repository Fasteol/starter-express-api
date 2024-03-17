const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const port = 8000;

const app = express();

app.use(
  cors({
    methods: ["GET", "DELETE", "POST", "PUT"],
  })
);
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

app.post("/blogs", async (req, res) => {
  try {
    const data = await fs.readFile(filePath);
    let jsonData = JSON.parse(data);

    // Mendapatkan data blog baru dari body request
    const newBlog = req.body;

    // Menambahkan ID unik untuk blog baru
    const newId = generateUniqueId(); // Anda perlu membuat fungsi generateUniqueId sesuai kebutuhan

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
