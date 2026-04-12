const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const { transList } = require('./storage/transactionsList.js');
// Cần có để express.static hoạt động (?)
const path = require('path');
// Giả sử ảnh của bạn nằm ở: D:\TTCS Project\...\assets\category_icon
// Dùng express.static để "mở cửa" thư mục này
app.use('/api/images', express.static('../Frontend/src/assets/category_icon'));

// Node.js mặc định xử lý các file .js theo chuẩn CommonJS (sử dụng require) 
// Trong khi câu lệnh import thuộc chuẩn ES Modules (ESM) => Gây lỗi

app.use(cors());

let generalStat = { income: 0, expense: 0 };

generalStat.income = transList
    .filter(item => item.type === 'Thu nhập')
    .reduce((sum, item) => sum + item.amount, 0);

generalStat.expense = transList
    .filter(item => item.type === 'Chi tiêu')
    .reduce((sum, item) => sum + item.amount, 0);

app.get('/api/data', (req, res) => {
    res.json(generalStat);
});
// Chữ data có thể đổi thành từ khác 
// Phần liên kết có thể đổi, nhưng chữ data ở jsx cần giữ nguyên (.then)
// Sau này có thể đặt nhiều app.get vào 1 file server này

app.get('/api/translist', (req, res) => {
    res.json(transList);
});

app.listen(PORT, () => console.log(`Backend is run at ${PORT}`));
