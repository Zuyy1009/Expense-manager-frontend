let transList = [
    {
        id: 1,
        type: 'Chi tiêu',
        amount: 110000,
        category: 'Ăn uống',
        categoryIcon: 'http://localhost:8080/api/images/eating.png',
        date: '12-04-2026',
        note: 'Ăn chực ở Loteria',
        dateCreated: '12-04-2026'
    },
        {
        id: 2,
        type: 'Chi tiêu',
        amount: 68000,
        category: 'Đi lại',
        categoryIcon: 'http://localhost:8080/api/images/movement.png',
        date: '09-04-2026',
        note: 'Bắt xe ra XXXXMall',
        dateCreated: '09-04-2026'
    },
        {
        id: 3,
        type: 'Thu nhập',
        amount: 12000000,
        category: 'Lương',
        categoryIcon: 'http://localhost:8080/api/images/salary.png',
        date: '31-03-2026',
        note: 'Lương tháng 3',
        dateCreated: '31-03-2026'
    },
];

module.exports = { transList };

// Node.js mặc định xử lý các file .js theo chuẩn CommonJS (sử dụng require) 
// Trong khi câu lệnh import thuộc chuẩn ES Modules (ESM) => Gây lỗi .
