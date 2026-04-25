const { iconsMap } = require('./iconsList.js');
const { transList } = require('./transactionsList.js');

let catesListWithoutIcon = [
    {
        id: 1,
        name: 'Ăn uống',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Ăn uống').reduce((s, i) => s + i.amount, 0),
        isDefault: true,
        createdAt: '20-12-2022'
    },
    {
        id: 2,
        name: 'Đơn điện tử',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Đơn điện tử').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 3,
        name: 'Sức khỏe',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Sức khỏe').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 4,
        name: 'Nhà ở',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Nhà ở').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 5,
        name: 'Đi lại',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Đi lại').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 6,
        name: 'Giải trí',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Giải trí').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 7,
        name: 'Mua sắm',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Mua sắm').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 8,
        name: 'Chi tiêu khác',
        type: 'Chi tiêu',
        amountMade: transList.filter(i => i.category === 'Chi tiêu khác').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 9,
        name: 'Lương',
        type: 'Thu nhập',
        amountMade: transList.filter(i => i.category === 'Lương').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
    {
        id: 10,
        name: 'Thu nhập khác',
        type: 'Thu nhập',
        amountMade: transList.filter(i => i.category === 'Thu nhập khác').reduce((s, i) => s + i.amount, 0),
        isDefault: false,
        createdAt: '20-12-2022'
    },
];

let catesList = catesListWithoutIcon.map(item => ({
    ...item,
    icon: `http://localhost:8080/api/images/${iconsMap[item.category]}.png`
}));

module.exports = { catesList };
