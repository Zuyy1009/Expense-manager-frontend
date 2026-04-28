const { iconsMap } = require('./iconsList.js');
const Category = require('../models/Category.js');
const Transaction = require('../models/Transaction.js');

const getCategoriesWithStats = async () => {
    try {
        // 1. Lấy danh sách danh mục và danh sách giao dịch từ MongoDB
        const categories = await Category.find({}).lean();
        const transactions = await Transaction.find({}).lean();

        // 2. Kết hợp dữ liệu
        return categories.map(cate => {
            // Tính tổng tiền cho từng danh mục dựa trên tên
            const total = transactions
                .filter(t => t.category === cate.name)
                .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

            return {
                ...cate,
                id: cate._id, // Sử dụng _id từ MongoDB
                icon: `http://localhost:8080/api/images/${iconsMap[cate.name] || 'default'}.png`,
                amountMade: total
            };
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ MongoDB:", error);
        return [];
    }
};

module.exports = { getCategoriesWithStats };

/* let catesListWithoutIcon = [
    {
        id: 1,
        name: 'Ăn uống',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 2,
        name: 'Đơn điện tử',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 3,
        name: 'Sức khỏe',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 4,
        name: 'Nhà ở',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 5,
        name: 'Đi lại',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 6,
        name: 'Giải trí',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 7,
        name: 'Mua sắm',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 8,
        name: 'Chi tiêu khác',
        type: 'Chi tiêu',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 9,
        name: 'Lương',
        type: 'Thu nhập',
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 10,
        name: 'Thu nhập khác',
        type: 'Thu nhập',
        isDefault: true,
        createdAt: '20-12-2022'
    },
]; */
