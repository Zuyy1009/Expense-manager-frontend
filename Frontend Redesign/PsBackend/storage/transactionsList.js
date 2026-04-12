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
        amount: 18000000,
        category: 'Lương',
        categoryIcon: 'http://localhost:8080/api/images/salary.png',
        date: '31-03-2026',
        note: 'Lương tháng 3',
        dateCreated: '31-03-2026'
    },
    {
        id: 4,
        type: 'Chi tiêu',
        amount: 1300000,
        category: 'Nhà ở',
        categoryIcon: 'http://localhost:8080/api/images/housing.png',
        date: '30-03-2026',
        note: 'Tiền nhà tháng 4',
        dateCreated: '30-03-2026'
    },
    {
        id: 5,
        type: 'Chi tiêu',
        amount: 125000,
        category: 'Đơn điện tử',
        categoryIcon: 'http://localhost:8080/api/images/elecbill.png',
        date: '28-03-2026',
        note: 'Tiền điện tháng 3',
        dateCreated: '28-03-2026'
    },
    {
        id: 6,
        type: 'Thu nhập',
        amount: 50000,
        category: 'Thu nhập khác',
        categoryIcon: 'http://localhost:8080/api/images/otherincome.png',
        date: '26-03-2026',
        note: 'Tiền thưởng từ [?]',
        dateCreated: '25-03-2026'
    },
    {
        id: 7,
        type: 'Chi tiêu',
        amount: 350000,
        category: 'Mua sắm',
        categoryIcon: 'http://localhost:8080/api/images/shopping.png',
        date: '23-03-2026',
        note: 'Mua quần áo',
        dateCreated: '23-03-2026'
    },
    {
        id: 8,
        type: 'Chi tiêu',
        amount: 75000,
        category: 'Sức khỏe',
        categoryIcon: 'http://localhost:8080/api/images/health.png',
        date: '17-03-2026',
        note: 'Thuốc cảm cúm',
        dateCreated: '17-03-2026'
    },
];

module.exports = { transList };

// Node.js mặc định xử lý các file .js theo chuẩn CommonJS (sử dụng require)
// Trong khi câu lệnh import thuộc chuẩn ES Modules (ESM) => Gây lỗi .
