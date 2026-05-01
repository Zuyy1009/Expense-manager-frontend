require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 8080;
const { getTransList } = require('./storage/transactionsList.js');  // Lấy dữ liệu hiển thị
const Transaction = require('./models/Transaction.js'); // Thêm/Sửa/Xóa
const { iconsMap } = require('./storage/iconsList.js');
const { getBudgetsWithProgress } = require('./storage/budgetsList.js');
const Budget = require('./models/Budget.js');
const { getCategoriesWithStats } = require('./storage/categoriesList.js');
const Category = require('./models/Category.js');
const { getNotesList } = require('./storage/notesList.js');
const Note = require('./models/Note.js');
const User = require('./models/User.js');
// Cần có để express.static hoạt động (?)
const path = require('path');
// Giả sử ảnh của bạn nằm ở: D:\TTCS Project\...\assets\category_icon
// Dùng express.static để "mở cửa" thư mục này

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB: exmn"))
    .catch(err => console.error("Could not connect to MongoDB", err));

app.use('/api/images', express.static(path.join(__dirname, '../Frontend/src/assets/category_icon')));

// Node.js mặc định xử lý các file .js theo chuẩn CommonJS (sử dụng require) 
// Trong khi câu lệnh import thuộc chuẩn ES Modules (ESM) => Gây lỗi

app.use(cors());

// Cần để req.body không gặp lỗi undefined. Không cần dùng JSON.parse(req.body)
app.use(express.json());

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user theo email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại!" });
        }

        // 2. So sánh mật khẩu thô (Vì chưa hash nên so sánh chuỗi trực tiếp)
        if (user.password !== password) {
            return res.status(401).json({ message: "Mật khẩu không chính xác!" });
        }

        // 3. Đăng nhập thành công -> Trả về thông tin user (trừ password)
        // Lưu ý: Ta trả về _id để Frontend dùng làm userId cho các collection khác
        res.json({
            message: "Đăng nhập thành công!",
            userId: user._id,
            username: user.username
        });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server!" });
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const { userId } = req.query; // Lấy userId từ phần sau dấu '?' ở frontend
        const transList = await getTransList(userId) || []; // Đảm bảo luôn là mảng

        const income = transList
            .filter(i => i && i.type === 'Thu nhập') // Kiểm tra i tồn tại
            .reduce((s, i) => s + (Number(i.amount) || 0), 0);

        const expense = transList
            .filter(i => i && i.type === 'Chi tiêu')
            .reduce((s, i) => s + (Number(i.amount) || 0), 0);

        res.json({ income, expense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ income: 0, expense: 0, message: "Lỗi tính toán" });
    }
});
// Chữ data có thể đổi thành từ khác 
// Phần liên kết có thể đổi, nhưng chữ data ở jsx cần giữ nguyên (.then)
// Sau này có thể đặt nhiều app.get vào 1 file server này

app.get('/api/translist', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const transList = await getTransList(userId);
        res.json(transList);
    } catch {
        res.status(500).json({ message: "Lỗi Server" });
    }
});

app.get('/api/iconslist', (req, res) => {
    res.json(iconsMap);
});

app.get('/api/categorieslist', async (req, res) => {
    const catesList = await getCategoriesWithStats();
    res.json(catesList);
});

app.get('/api/nslist', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const nsList = await getNotesList(userId);
        res.json(nsList);
    } catch {
        res.status(500).json({ message: "Lỗi Server" });
    }
});

// Xử lý thêm giao dịch mới
app.post('/api/add-transaction', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const newTrans = new Transaction(req.body); // Tạo instance mới từ model
        await newTrans.save(); // Lưu trực tiếp vào MongoDB

        const updatedList = await getTransList(userId); // Lấy lại danh sách mới nhất của riêng user đó
        res.json(updatedList);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi khi thêm dữ liệu");
    }
});

app.put('/api/update-transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, ...updatedData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        // Sử dụng findByIdAndUpdate để cập nhật thẳng vào MongoDB
        await Transaction.findByIdAndUpdate(id, updatedData);

        const updatedList = await getTransList(userId);
        res.json(updatedList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi cập nhật" });
    }
});

app.delete('/api/delete-transactions', async (req, res) => {
    try {
        const { ids, userId } = req.body;

        if (!userId || !ids || ids.length === 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
        }

        // Xóa các bản ghi có _id nằm trong mảng ids VÀ thuộc về userId này
        await Transaction.deleteMany({ 
            _id: { $in: ids }, 
            userId: userId 
        });

        const updatedList = await getTransList(userId);
        res.json(updatedList);
    } catch {
        console.error(err);
        res.status(500).json({ message: "Lỗi cập nhật" });
    }
});

app.get('/api/budgetslist', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const budgsList = await getBudgetsWithProgress(userId);
        res.json(budgsList);
    } catch {
        res.status(500).json({ message: "Lỗi Server" });
    }
});

app.post('/api/add-budget', async (req, res) => {
    try {
        const newBudg = new Budget(req.body);
        await newBudg.save();

        const updatedList = await getBudgetsWithProgress();
        res.json(updatedList);
    } catch {
        res.status(500).send("Lỗi khi thêm dữ liệu");
    }
});

app.put('/api/update-budget/:id', async (req, res) => {
    try {
        const { id } = req.params; /* Lưu ý phải phân ra cấu trúc bằng cặp {} */
        const updatedData = req.body;

        await Budget.findByIdAndUpdate(id, updatedData);

        const updatedList = await getBudgetsWithProgress();
        res.json(updatedList);
    } catch {
        res.status(500).json({ message: "Lỗi cập nhật" });
    }
});

app.delete('/api/delete-budget', async (req, res) => {
    try {
        const { id } = req.body;

        await Budget.findByIdAndDelete(id);

        const updatedList = await getBudgetsWithProgress();
        res.json(updatedList);
    } catch {
        res.status(500).json({ message: "Lỗi cập nhật" });
    }
});

app.delete('/api/delete-all-budgets', async (req, res) => {
    try {
        await Budget.deleteMany({});

        res.json([]);
    } catch {
        res.status(500).json({ message: "Lỗi cập nhật" });
    }
});

app.listen(PORT, () => console.log(`Backend is run at ${PORT}`));
