const { iconsMap } = require('./iconsList.js');
const { transList } = require('./transactionsList.js');

let catesListWithoutIcon = [
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
];

let catesList = catesListWithoutIcon.map(item => ({
    ...item,
    icon: `http://localhost:8080/api/images/${iconsMap[item.name]}.png`,
    amountMade: transList.filter(i => i.category === item.name).reduce((s, i) => s + i.amount, 0)
}));

module.exports = { catesList };
