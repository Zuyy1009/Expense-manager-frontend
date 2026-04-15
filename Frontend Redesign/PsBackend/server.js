const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;
const { transList } = require('./storage/transactionsList.js');
// Cần có để express.static hoạt động (?)
const path = require('path');
// Giả sử ảnh của bạn nằm ở: D:\TTCS Project\...\assets\category_icon
// Dùng express.static để "mở cửa" thư mục này
app.use('/api/images', express.static(path.join(__dirname, '../Frontend/src/assets/category_icon')));

// Node.js mặc định xử lý các file .js theo chuẩn CommonJS (sử dụng require) 
// Trong khi câu lệnh import thuộc chuẩn ES Modules (ESM) => Gây lỗi

app.use(cors());

// Cần để req.body không gặp lỗi undefined. Không cần dùng JSON.parse(req.body)
app.use(express.json());

app.get('/api/data', (req, res) => {
    const income = transList.filter(i => i.type === 'Thu nhập').reduce((s, i) => s + i.amount, 0);
    const expense = transList.filter(i => i.type === 'Chi tiêu').reduce((s, i) => s + i.amount, 0);
    res.json({ income, expense });
});
// Chữ data có thể đổi thành từ khác 
// Phần liên kết có thể đổi, nhưng chữ data ở jsx cần giữ nguyên (.then)
// Sau này có thể đặt nhiều app.get vào 1 file server này

app.get('/api/translist', (req, res) => {
    res.json(transList);
});

// Xử lý thêm giao dịch mới
app.post('/api/add-transaction', (req, res) => {
    const newTrans = req.body; 

    // Tạo Id mới
    const newId = transList.length > 0
    ? Math.max(...transList.map(t => t.id)) + 1
    : 1;

    // Tạo object hoàn chỉnh để đưa vào mảng
    const transactionToSave = {
        id: newId,
        ...newTrans // 
    }

    transList.push(transactionToSave);

    // Trả về danh sách giao dịch mới để Frontend cập nhật lại giao diện
    res.json(transList);
});

app.put('/api/update-transaction/:id', (req, res) => {
    const { id } = req.params; // Thêm ngoặc kép để destructuring
    const updatedTrans = req.body;

    const index = transList.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
        // Ghi đè thuộc tính trùng nhau của obj bên phải lên obj bên trái
        transList[index] = {...transList[index], ...updatedTrans};
        res.json(transList);
    } else {
        res.status(404).json({ message: "Không tìm thấy giao dịch."});
    }
});

app.delete('/api/delete-transactions', (req, res) => {
    const { ids } = req.body; // Lấy mảng ID từ frontend gửi về

    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
    }

    // Thực hiện lọc: Chỉ giữ lại những item có id KHÔNG nằm trong mảng ids
    // Lưu ý: Nếu transList là hằng số (const), bạn phải dùng các hàm thay đổi tại chỗ 
    // hoặc đổi transList sang let. Ở đây ta giả sử transList có thể cập nhật được.
    
    // Cách 1: Nếu transList là mảng global có thể thay đổi (thông qua lọc)
    const originalLength = transList.length;
    
    // Xóa bằng cách lọc (Filter)
    // Lưu ý: Cần gán lại giá trị cho mảng nếu file storage cho phép
    const newTransList = transList.filter(item => !ids.includes(item.id));
    
    // Cập nhật lại mảng chính (xóa sạch mảng cũ và push mảng mới vào để giữ tham chiếu)
    transList.length = 0; 
    transList.push(...newTransList);

    console.log(`Đã xóa ${originalLength - transList.length} giao dịch.`);

    // Trả về danh sách mới nhất để Frontend đồng bộ UI
    res.json(transList);
});

app.listen(PORT, () => console.log(`Backend is run at ${PORT}`));
