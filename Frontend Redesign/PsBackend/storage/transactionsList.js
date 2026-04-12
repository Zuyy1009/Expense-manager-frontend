import { Eating, Elecbill, Health, Housing, Movement, Otherexpense, Otherincome, Recreation, Salary, Shopping } from "../../Frontend/src/assets/category_icon/category-image";

export let transList = [
    {
        id: 1,
        type: 'Chi tiêu',
        amount: 110000,
        category: 'Ăn uống',
        categoryIcon: Eating,
        date: '12-04-2026',
        note: 'Ăn chực ở Loteria',
        dateCreated: '12-04-2026'
    },
        {
        id: 2,
        type: 'Chi tiêu',
        amount: 68000,
        category: 'Đi lại',
        categoryIcon: Movement,
        date: '09-04-2026',
        note: 'Bắt xe ra XXXXMall',
        dateCreated: '09-04-2026'
    },
        {
        id: 3,
        type: 'Thu nhập',
        amount: 12000000,
        category: 'Lương',
        categoryIcon: Salary,
        date: '31-03-2026',
        note: 'Lương tháng 3',
        dateCreated: '31-03-2026'
    },
];
