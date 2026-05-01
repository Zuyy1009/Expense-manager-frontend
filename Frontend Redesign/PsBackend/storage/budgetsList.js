const mongoose = require('mongoose');
const { iconsMap } = require('./iconsList.js');
// 1. Phải import ĐÚNG Model để truy vấn Database
const Transaction = require('../models/Transaction.js');
const Budget = require('../models/Budget.js');

const getBudgetsWithProgress = async (userId) => {
    try {
        // 1. Lấy tất cả ngân sách và giao dịch từ DB
        const queryId = new mongoose.Types.ObjectId(userId);
        const budgets = await Budget.find({ userId: queryId }).lean();
        const transactions = await Transaction.find({ type: 'Chi tiêu' }).lean();

        // 2. Map để tính toán số tiền đã dùng và gắn icon
        return budgets.map(budget => {
            // Lấy mã tháng từ bid (ví dụ: '26_04-1' -> '04')
            const budgetMonth = budget.bid.substring(3, 5);

            const consumed = transactions
                .filter(t => t.category === budget.category && t.date.substring(3, 5) === budgetMonth)
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                ...budget,
                id: budget._id,
                categoryIcon: `http://localhost:8080/api/images/${iconsMap[budget.category] || 'default'}.png`,
                amountConsumed: consumed
            };
        });
    } catch (error) {
        console.error("Lỗi lấy ngân sách:", error);
        return [];
    }
};

module.exports = { Budget, getBudgetsWithProgress };

// Import từ Model: Thực hiện các thao tác ghi/xóa dữ liệu thô, không quan tâm đến Icon
// Import từ tệp list: Cần lấy dữ liệu để hiển thị lên giao diện
// - Cần cho Route GET: Khi cần danh sách đã có sẵn categoryIcon và định dạng ID để gửi về cho React/Frontend.
// - Tệp Ngân sách (budgetsList.js) cần danh sách giao dịch đã qua xử lý để tính amountConsumed.

/* let budgsListWithoutIcon = [
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Ăn uống',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 80,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Đơn điện tử',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Sức khỏe',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 50,
        isActive: false,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Nhà ở',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 1600000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Đi lại',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 1600000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Giải trí',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_04',
        category: 'Mua sắm',
        month: 'Tháng 4',
        year: '2026',
        limitAmount: 10000,
        alertThreshold: 70,
        isActive: false,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Ăn uống',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 80,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Đơn điện tử',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: false,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Sức khỏe',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 50,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Nhà ở',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 1400000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Đi lại',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 560000,
        alertThreshold: 75,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Giải trí',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 180000,
        alertThreshold: 75,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Mua sắm',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 730000,
        alertThreshold: 75,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        bid: '26_03',
        category: 'Chi tiêu khác',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 120000,
        alertThreshold: 75,
        isActive: true,
    },
    {
        userId: { 
           "$oid": '69f4021be61ae2b6a5d2d916'
        },
        bid: '26_03',
        category: 'Mua sắm',
        month: 'Tháng 3',
        year: '2026',
        limitAmount: 730000,
        alertThreshold: 75,
        isActive: true,
    },
]; */
