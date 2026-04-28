require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 8080;
const { getTransList } = require('./storage/transactionsList.js');
const { Transaction } = require('./models/Transaction.js');
const { iconsMap } = require('./storage/iconsList.js');
const { budgsList } = require('./storage/budgetsList.js');
const { catesList } = require('./storage/categoriesList.js');
const { nsList } = require('./storage/notesList.js');
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

app.get('/api/data', async (req, res) => {
    try {
        const transList = await getTransList() || []; // Đảm bảo luôn là mảng

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
    const transList = await getTransList();
    res.json(transList);
});

app.get('/api/iconslist', (req, res) => {
    res.json(iconsMap);
});

app.get('/api/categorieslist', (req, res) => {
    res.json(catesList);
});

app.get('/api/nslist', (req, res) => {
    res.json(nsList);
});

// Xử lý thêm giao dịch mới
app.post('/api/add-transaction', async (req, res) => {
    try {
        const newTrans = new Transaction(req.body); // Tạo instance mới từ model
        await newTrans.save(); // Lưu trực tiếp vào MongoDB

        const updatedList = await getTransList(); // Lấy lại danh sách mới nhất
        res.json(updatedList);
    } catch (err) {
        res.status(500).send("Lỗi khi thêm dữ liệu");
    }
});

app.put('/api/update-transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Sử dụng findByIdAndUpdate để cập nhật thẳng vào MongoDB
        await Transaction.findByIdAndUpdate(id, updatedData);

        const updatedList = await getTransList();
        res.json(updatedList);
    } catch (err) {
        res.status(500).json({ message: "Lỗi cập nhật" });
    }
});

app.delete('/api/delete-transactions', async (req, res) => {
    const { ids } = req.body;
    // Xóa tất cả các bản ghi có _id nằm trong mảng ids
    await Transaction.deleteMany({ _id: { $in: ids } });

    const updatedList = await getTransList();
    res.json(updatedList);
});

app.get('/api/budgetslist', (req, res) => {
    res.json(budgsList);
});

app.listen(PORT, () => console.log(`Backend is run at ${PORT}`));
