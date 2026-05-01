const Note = require('../models/Note.js');
const mongoose = require('mongoose');

const getNotesList = async (userId) => {
    try {
        const queryId = new mongoose.Types.ObjectId(userId);
        const data = await Note.find({ userId: queryId }).lean();

        const nsList = data;
        return nsList;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        return [];
    }
};

module.exports = { getNotesList };

/* let nsList = [
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        title: 'Note A',
        content: 'Chi tiêu phần ăn uống ít lại'
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        title: 'Note B',
        content: 'Thiết lập aabb'
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        title: 'Note A',
        content: 'On the Insert tab, the galleries include items that are designed to coordinate with the overall look of your document. You can use these galleries to insert tables, headers, footers, lists, cover pages, and other document building blocks.'
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        title: 'Note B',
        content: 'Thiết lập aabb,On the Insert tab, the galleries include items that are designed to coordinate with the overall look of your document. You can use these galleries to insert tables, headers, footers, lists, cover pages, and other document building blocks.'
    },
    {
        userId: { 
           "$oid": '69f304a59400fcc7aeed1cb3'
        },
        title: 'Note A',
        content: 'Thiết lập aabb'
    },
    {
        userId: { 
           "$oid": '69f4021be61ae2b6a5d2d916'
        },
        title: 'Note A',
        content: 'Thiết lập aabb'
    },
    {
        userId: { 
           "$oid": '69f4021be61ae2b6a5d2d916'
        },
        title: 'Note B',
        content: 'Thiết lập aabb'
    },
]; */
