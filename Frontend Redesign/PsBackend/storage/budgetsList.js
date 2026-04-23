const { getIconName } = require('./iconsList.js');

let budgsListWithoutIcon = [
    {
        id: '26_04-1',
        category: 'Ăn uống',
        month: 'April',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 80,
        isActive: true,
    },
    {
        id: '26_04-2',
        category: 'Đơn điện tử',
        month: 'April',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        id: '26_04-3',
        category: 'Sức khỏe',
        month: 'April',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 50,
        isActive: true,
    },
    {
        id: '26_04-4',
        category: 'Nhà ở',
        month: 'April',
        year: '2026',
        limitAmount: 600000,
        alertThreshold: 70,
        isActive: true,
    },
    {
        id: '26_03-1',
        category: 'Ăn uống',
        month: 'March',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 80,
        isActive: true,
    },
    {
        id: '26_03-2',
        category: 'Đơn điện tử',
        month: 'March',
        year: '2026',
        limitAmount: 300000,
        alertThreshold: 70,
        isActive: false,
    },
    {
        id: '26_03-3',
        category: 'Sức khỏe',
        month: 'March',
        year: '2026',
        limitAmount: 500000,
        alertThreshold: 50,
        isActive: true,
    },
    {
        id: '26_03-4',
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
