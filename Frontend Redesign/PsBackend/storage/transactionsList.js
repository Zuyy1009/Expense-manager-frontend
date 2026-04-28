const mongoose = require('mongoose');
const { iconsMap } = require('./iconsList.js');
const Transaction = require('../models/Transaction.js');

// Vì làm việc với DB là bất đồng bộ  dùng async/await
const getTransList = async () => {
    try {
        // Lấy dữ liệu từ MongoDB
        const data = await Transaction.find({}).lean();

        // Map để gắn thêm icon
        const transList = data.map(item => ({
            ...item,
            // Chuyển _id thành id để tương thích nếu Frontend cần
            categoryIcon: `http://localhost:8080/api/images/${iconsMap[item.category] || 'default'}.png`
        }));

        return transList;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return [];
    }
}

/* let transListWithoutIcon = [
    {
        id: 1,
        type: 'Chi tiêu',
        amount: 110000,
        category: 'Ăn uống',
        date: '12-04-2026',
        note: 'Ăn chực ở Loteria',
        dateCreated: '12-04-2026'
    },
    {
        id: 2,
        type: 'Chi tiêu',
        amount: 68000,
        category: 'Đi lại',
        date: '09-04-2026',
        note: 'Bắt xe ra XXXXMall',
        dateCreated: '09-04-2026'
    },
    {
        id: 3,
        type: 'Thu nhập',
        amount: 18000000,
        category: 'Lương',
        date: '31-03-2026',
        note: 'Lương tháng 3',
        dateCreated: '31-03-2026'
    },
    {
        id: 4,
        type: 'Chi tiêu',
        amount: 1300000,
        category: 'Nhà ở',
        date: '30-03-2026',
        note: 'Tiền nhà tháng 4',
        dateCreated: '30-03-2026'
    },
    {
        id: 5,
        type: 'Chi tiêu',
        amount: 125000,
        category: 'Đơn điện tử',
        date: '28-03-2026',
        note: 'Tiền điện tháng 3',
        dateCreated: '28-03-2026'
    },
    {
        id: 6,
        type: 'Thu nhập',
        amount: 50000,
        category: 'Thu nhập khác',
        date: '26-03-2026',
        note: 'Tiền thưởng từ [?]',
        dateCreated: '25-03-2026'
    },
    {
        id: 7,
        type: 'Chi tiêu',
        amount: 350000,
        category: 'Mua sắm',
        date: '23-03-2026',
        note: 'Mua quần áo',
        dateCreated: '23-03-2026'
    },
    {
        id: 8,
        type: 'Chi tiêu',
        amount: 75000,
        category: 'Sức khỏe',
        date: '17-03-2026',
        note: 'Thuốc cảm cúm',
        dateCreated: '17-03-2026'
    },
    {
        id: 9,
        type: 'Chi tiêu',
        amount: 85000,
        category: 'Đi lại',
        date: '15-03-2026',
        note: 'Taxi đến Nơi AX',
        dateCreated: '17-03-2026'
    },
    {
        id: 10,
        type: 'Chi tiêu',
        amount: 34000,
        category: 'Ăn uống',
        date: '13-03-2026',
        note: 'Ăn chực ở KFC',
        dateCreated: '14-03-2026'
    },
    {
        id: 11,
        type: 'Chi tiêu',
        amount: 144000,
        category: 'Giải trí',
        date: '09-03-2026',
        note: 'Đi chơi ở XXDDXDD',
        dateCreated: '09-03-2026'
    },
    {
        id: 12,
        type: 'Chi tiêu',
        amount: 98000,
        category: 'Sức khỏe',
        date: '04-03-2026',
        note: 'Thuốc bổ mắt',
        dateCreated: '05-03-2026'
    },
    {
        id: 13,
        type: 'Thu nhập',
        amount: 204000,
        category: 'Thu nhập khác',
        date: '05-03-2026',
        note: 'Tiền lì xì từ D?Dxx',
        dateCreated: '05-03-2026'
    },
    {
        id: 14,
        type: 'Chi tiêu',
        amount: 84000,
        category: 'Ăn uống',
        date: '02-03-2026',
        note: 'KFCKFC',
        dateCreated: '02-03-2026'
    },
    {
        id: 15,
        type: 'Chi tiêu',
        amount: 80000,
        category: 'Mua sắm',
        date: '01-03-2026',
        note: 'Mua quần áo II',
        dateCreated: '02-03-2026'
    },
]; */

module.exports = { Transaction, getTransList };

// Node.js mặc định xử lý các file .js theo chuẩn CommonJS (sử dụng require)
// Trong khi câu lệnh import thuộc chuẩn ES Modules (ESM) => Gây lỗi .
