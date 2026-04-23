const { getIconName } = require('./iconsList.js');

let budgsListWithoutIcon = [
    {
        id: '26Ap-1',
        category: 'Ăn uống',
        month: 'April',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 80,
        isActive: true,
    },
    {
        id: '26Ap-2',
        category: 'Đơn điện tử',
        month: 'April',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        id: '26Ap-3',
        category: 'Sức khỏe',
        month: 'April',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 50,
        isActive: true,
    },
    {
        id: '26Ap-4',
        category: 'Nhà ở',
        month: 'April',
        year: '2026',
        limitAmount: 600000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        id: '26Ma-1',
        category: 'Ăn uống',
        month: 'March',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 80,
        isActive: true,
    },
    {
        id: '26Ma-2',
        category: 'Đơn điện tử',
        month: 'March',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: false,
    },
    {
        id: '26Ma-3',
        category: 'Sức khỏe',
        month: 'March',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 50,
        isActive: true,
    },
    {
        id: '26Ma-4',
        category: 'Nhà ở',
        month: 'March',
        year: '2026',
        limitAmount: 600000,
        alertThreshold: 70,
        isActive: false,
    },
];

let budgsList = budgsListWithoutIcon.map(item => ({
    ...item,
    categoryIcon: `http://localhost:8080/api/images/${getIconName(item.category)}.png`
}));

module.exports = { budgsList };
