import express from "express";
import Task from "../models/Task.js";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /api/tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, category, search, startDate, endDate, archived } = req.query;

    const filter = {
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    };

    // Filter by archived status
    if (archived === 'true') {
      filter.isArchived = true;
    } else if (archived === 'false') {
      filter.isArchived = false;
    } else {
      // Default: exclude archived tasks
      filter.isArchived = false;
    }

    if (status) filter.status = status;
    if (category) filter.category = category;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    const tasks = await Task.find(filter)
      .populate("category", "name color")
      .populate("createdBy", "username email")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// GET /api/tasks/dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userFilter = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      isArchived: false, // Exclude archived tasks from main stats
    };

    const archivedFilter = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
      isArchived: true, // Include only archived tasks
    };

    const now = new Date();
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [total, done, inProgress, todo, overdue, archivedCount, archivedTasks] = await Promise.all([
      Task.countDocuments(userFilter),
      Task.countDocuments({ ...userFilter, status: "done" }),
      Task.countDocuments({ ...userFilter, status: "in-progress" }),
      Task.countDocuments({ ...userFilter, status: "todo" }),
      Task.countDocuments({ ...userFilter, status: { $ne: "done" }, dueDate: { $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } }),
      Task.countDocuments(archivedFilter),
      Task.find(archivedFilter)
        .populate("category", "name color")
        .populate("createdBy", "username email")
        .populate("assignedTo", "username email")
        .sort({ updatedAt: -1 })
        .limit(5), // Get only 5 recent archived tasks
    ]);

    res.json({ 
      total, 
      done, 
      inProgress, 
      todo, 
      overdue, 
      archived: archivedCount,
      recentArchivedTasks: archivedTasks 
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// GET /api/tasks/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    })
      .populate("category", "name color")
      .populate("createdBy", "username email")
      .populate("assignedTo", "username email");

    if (!task) {
      return res.status(404).json({ message: "ไม่พบงาน" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// POST /api/tasks
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, category, dueDate, assignedTo, tags } =
      req.body;

    if (!title) {
      return res.status(400).json({ message: "กรุณาระบุชื่องาน" });
    }

    // ตรวจสอบว่า category เป็นของ user คนนั้นจริงๆ (ถ้ามีการส่ง category มา)
    let validCategory = null;
    if (category) {
      const categoryDoc = await Category.findOne({
        _id: category,
        userId: req.user._id
      });
      if (!categoryDoc) {
        return res.status(400).json({ message: "ไม่พบหมวดหมู่นี้ หรือไม่มีสิทธิ์ใช้" });
      }
      validCategory = category;
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      category: validCategory,
      dueDate: dueDate || null,
      assignedTo: assignedTo || [],
      tags: tags || [],
      createdBy: req.user._id,
    });

    const populated = await task.populate([
      { path: "category", select: "name color" },
      { path: "createdBy", select: "username email" },
      { path: "assignedTo", select: "username email" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// PUT /api/tasks/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "ไม่พบงาน หรือไม่มีสิทธิ์แก้ไข" });
    }

    const { title, description, status, category, dueDate, assignedTo, tags } =
      req.body;

    // ตรวจสอบว่า category เป็นของ user คนนั้นจริงๆ (ถ้ามีการส่ง category มา)
    let validCategory = undefined;
    if (category !== undefined) {
      if (category === null || category === "") {
        validCategory = null;
      } else {
        const categoryDoc = await Category.findOne({
          _id: category,
          userId: req.user._id
        });
        if (!categoryDoc) {
          return res.status(400).json({ message: "ไม่พบหมวดหมู่นี้ หรือไม่มีสิทธิ์ใช้" });
        }
        validCategory = category;
      }
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (validCategory !== undefined) task.category = validCategory;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (tags !== undefined) task.tags = tags;

    await task.save();

    const populated = await task.populate([
      { path: "category", select: "name color" },
      { path: "createdBy", select: "username email" },
      { path: "assignedTo", select: "username email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: "ไม่พบงาน หรือไม่มีสิทธิ์ลบ" });
    }

    res.json({ message: "ลบงานสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// PUT /api/tasks/:id/archive
router.put("/:id/archive", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    });

    if (!task) {
      return res.status(404).json({ message: "ไม่พบงาน หรือไม่มีสิทธิ์" });
    }

    task.isArchived = true;
    await task.save();

    const populated = await task.populate([
      { path: "category", select: "name color" },
      { path: "createdBy", select: "username email" },
      { path: "assignedTo", select: "username email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

// PUT /api/tasks/:id/unarchive
router.put("/:id/unarchive", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }],
    });

    if (!task) {
      return res.status(404).json({ message: "ไม่พบงาน หรือไม่มีสิทธิ์" });
    }

    task.isArchived = false;
    await task.save();

    const populated = await task.populate([
      { path: "category", select: "name color" },
      { path: "createdBy", select: "username email" },
      { path: "assignedTo", select: "username email" },
    ]);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
});

export default router;
