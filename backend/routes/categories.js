import express from "express";
import Category from "../models/Category.js";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /api/categories
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// POST /api/categories
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อหมวดหมู่" });
    }

    const existing = await Category.findOne({ name, userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "หมวดหมู่นี้มีอยู่แล้ว" });
    }

    const category = await Category.create({
      name,
      color: color || "#6366f1",
      userId: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// PUT /api/categories/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "ไม่พบหมวดหมู่" });
    }

    const { name, color } = req.body;
    if (name) category.name = name;
    if (color) category.color = color;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// DELETE /api/categories/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: "ไม่พบหมวดหมู่" });
    }

    // ล้าง category ใน tasks ที่เกี่ยวข้อง
    await Task.updateMany(
      { category: req.params.id },
      { category: null }
    );

    // ลบ category
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "ลบหมวดหมู่สำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

export default router;
