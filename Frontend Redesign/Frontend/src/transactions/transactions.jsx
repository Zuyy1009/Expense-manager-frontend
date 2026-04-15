import styles from './transactions.module.css'
import { useState, useEffect } from 'react';

export function Transactions() {
    const [transList, setTransList] = useState([]);
    // SetState là bất đồng bộ, khi setState(newValue), React không cập nhật val đó ngay.
    // Nó sẽ đưa vào 1 hàng đợi trước. Vì thế nếu dùng ngay sau khi gọi hàm set, giá trị vẫn là cũ.
    // Không nên viết logic lọc bên trong hàm xử lý thay đổi.

    useEffect(() => {
        fetch("http://localhost:8080/api/translist")
            .then(res => res.json())
            .then(data => {
                setTransList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    const [chosenCategory, setChosenCategory] = useState('all-category');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [addEdit, setAddEdit] = useState(0);

    const filteredTransList = transList.filter(item => {
        const matchCategory = (chosenCategory === 'all-category' || item.category === chosenCategory);

        const price = Number(item.amount);
        const matchPrice = (!minPrice || price >= Number(minPrice)) && (!maxPrice || price <= Number(maxPrice));

        const dateToCompare = item.date.slice(6, 10) + '-' + item.date.slice(3, 5) + '-' + item.date.slice(0, 2);
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const iDate = new Date(dateToCompare);
        const matchDate = (!sDate.getTime() || iDate.getTime() >= sDate.getTime()) && (!eDate.getTime() || iDate.getTime() <= eDate.getTime());

        return matchCategory && matchPrice && matchDate;
    });

    const handleSelectChange = (e) => {
        // Lấy giá trị của option được chọn qua e.target.value
        setChosenCategory(e.target.value);
    };

    const handleMinPrice = (e) => {
        setMinPrice(e.target.value);
    }

    const handleMaxPrice = (e) => {
        setMaxPrice(e.target.value);
    }

    const handleStartDate = (e) => {
        setStartDate(e.target.value);
    }

    const handleEndDate = (e) => {
        setEndDate(e.target.value);
    }

    const handleAddButton = () => {
        if ((addEdit === 0) || (addEdit === 2)) {
            setAddEdit(1);
        } else {
            setAddEdit(0);
        }
    };

    const handleEditButton = () => {
        if ((addEdit === 0) || (addEdit === 1)) {
            setAddEdit(2);
        } else {
            setAddEdit(0);
        }
    }

    const [typeSelect, setTypeSelect] = useState('income');

    const handleTypeSelect = (e) => {
        setTypeSelect(e.target.value);
    };

    const [newNote, setNewNote] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState('Lương');

    // Tự động cập nhật danh mục mặc định khi thay đổi loại giao dịch (Thu nhập <-> Chi phí)
    useEffect(() => {
        if (typeSelect === 'expense') {
            setNewCategory('Ăn uống'); // Giá trị mặc định khi chọn Chi phí
        } else {
            setNewCategory('Lương');   // Giá trị mặc định khi chọn Thu nhập
        }
    }, [typeSelect]); // Hàm này sẽ chạy mỗi khi typeSelect thay đổi

    const handleConfirmAdd = () => {
        if (!newNote || !newAmount || !newDate) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        let chosenCategoryIcon = '';

        switch (newCategory) {
            case 'Ăn uống':
                chosenCategoryIcon = 'eating';
                break;
            case 'Đơn điện tử':
                chosenCategoryIcon = 'elecbill';
                break;
            case 'Sức khỏe':
                chosenCategoryIcon = 'health';
                break;
            case 'Nhà ở':
                chosenCategoryIcon = 'housing';
                break;
            case 'Đi lại':
                chosenCategoryIcon = 'movement';
                break;
            case 'Giải trí':
                chosenCategoryIcon = 'recreation';
                break;
            case 'Mua sắm':
                chosenCategoryIcon = 'shopping';
                break;
            case 'Chi tiêu khác':
                chosenCategoryIcon = 'otherexpense';
                break;
            case 'Lương':
                chosenCategoryIcon = 'salary';
                break;
            case 'Thu nhập khác':
                chosenCategoryIcon = 'otherincome';
                break;
            default:
                chosenCategoryIcon = 'salary';
        }

        const newTransaction = {
            note: newNote,
            type: typeSelect === 'income' ? 'Thu nhập' : 'Chi tiêu',
            category: newCategory,
            amount: Number(newAmount),
            date: newDate.split('-').reverse().join('-'),
            categoryIcon: `http://localhost:8080/api/images/${chosenCategoryIcon}.png`,
        }

        // Gửi yêu cầu POST đến backend
        fetch('http://localhost:8080/api/add-transaction', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTransaction)
        })
            .then(res => res.json())
            .then(updatedData => {
                setTransList(updatedData);
                setAddEdit(0);
                setNewNote('');
                setNewAmount('');
                setNewDate('');
                setNewCategory('Lương');
                alert("Đã thêm giao dịch!");
            })
            .catch(err => console.error("Lỗi khi thêm:", err));
    }

    const [editingId, setEditingId] = useState(null);
    const [editedNote, setEditedNote] = useState('');
    const [editedAmount, setEditedAmount] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [editedCategory, setEditedCategory] = useState('Lương');

    // Hàm xử lý khi 1 radio button được chọn
    const handleRadioChange = (id) => {
        setEditingId(id);
        const itemToEdit = transList.find(item => item.id === id);
        if (itemToEdit) {
            // Đổ dữ liệu hiện tại vào form
            setEditedNote(itemToEdit.note);
            setEditedAmount(itemToEdit.amount);
            setEditedDate(itemToEdit.date.split('-').reverse().join('-'));
            setTypeSelect(itemToEdit.type === 'Thu nhập' ? 'income' : 'expense');
            setEditedCategory(itemToEdit.category);
        }
    };

    useEffect(() => {
        if (addEdit === 2 && editingId) { // Chỉ chạy khi đang ở chế độ sửa
            if (typeSelect === 'expense') {
                setEditedCategory('Ăn uống');
            } else {
                setEditedCategory('Lương');
            }
        }
    }, [typeSelect, addEdit]);

    const handleConfirmEdit = () => {
        if (!editingId) {
            alert("Vui lòng chọn giao dịch để sửa!")
            return;
        }

        // Tái sử dụng logic lấy icon

        let chosenCategoryIcon = '';

        switch (editedCategory) {
            case 'Ăn uống':
                chosenCategoryIcon = 'eating';
                break;
            case 'Đơn điện tử':
                chosenCategoryIcon = 'elecbill';
                break;
            case 'Sức khỏe':
                chosenCategoryIcon = 'health';
                break;
            case 'Nhà ở':
                chosenCategoryIcon = 'housing';
                break;
            case 'Đi lại':
                chosenCategoryIcon = 'movement';
                break;
            case 'Giải trí':
                chosenCategoryIcon = 'recreation';
                break;
            case 'Mua sắm':
                chosenCategoryIcon = 'shopping';
                break;
            case 'Chi tiêu khác':
                chosenCategoryIcon = 'otherexpense';
                break;
            case 'Lương':
                chosenCategoryIcon = 'salary';
                break;
            case 'Thu nhập khác':
                chosenCategoryIcon = 'otherincome';
                break;
            default:
                chosenCategoryIcon = 'salary';
        }

        const updatedTransaction = {
            id: editingId,
            note: editedNote,
            type: typeSelect === 'income' ? 'Thu nhập' : 'Chi tiêu',
            category: editedCategory,
            amount: Number(editedAmount),
            date: editedDate.split('-').reverse().join('-'),
            categoryIcon: `http://localhost:8080/api/images/${chosenCategoryIcon}.png`
        };

        fetch(`http://localhost:8080/api/update-transaction/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTransaction),
        })
            .then(res => res.json())
            .then(updatedData => {
                setTransList(updatedData);
                setAddEdit(0);
                setEditingId(null);
                setEditedNote('');
                setEditedAmount('');
                setEditedDate('');
                setEditedCategory('Lương');
                alert("Đã sửa giao dịch!");
            })
            .catch(err => console.error("Lỗi khi sửa: ", err));
    }

    const [selectedIds, setSelectedIds] = useState([]); // Danh sách Id để xóa

    // Xử lý khi tick chọn từng ô checkbox
    const handleCheckboxChange = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    // Chọn tất cả
    const handleSelectAll = () => {
        const allFilteredIds = filteredTransList.map(item => item.id);
        setSelectedIds(allFilteredIds);
    };

    // Bỏ chọn tất cả
    const handleUnselectedAll = () => {
        setSelectedIds([]);
    }

    // Hàm xóa
    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một giao dịch để xóa!");
            return;
        }

        if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} giao dịch đã chọn?`)) {
            fetch('http://localhost:8080/api/delete-transactions', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }) // Gửi mảng ID
            })
                .then(res => {
                    if (!res.ok) throw new Error("Lỗi khi xóa từ server");
                    return res.json();
                })
                .then(updatedData => {
                    // Backend trả về danh sách mới sau khi xóa
                    setTransList(updatedData);
                    setSelectedIds([]); // Reset danh sách đã chọn
                    alert("Xóa thành công!");
                })
                .catch(err => {
                    console.error("Lỗi xóa:", err);
                    alert("Không thể xóa giao dịch, vui lòng thử lại.");
                });
        }
    }

    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['filter']} >
                <section className={styles['filter-region']}>
                    <strong>Bộ lọc</strong>
                    <label htmlFor='category' >Danh mục:</label>
                    <select name='category' id='category' className={styles['filt-selector']} value={chosenCategory} onChange={handleSelectChange} >
                        <option value='all-category' >Tất cả danh mục</option>
                        <option value='Ăn uống' >Ăn uống</option>
                        <option value='Đơn điện tử' >Đơn điện tử</option>
                        <option value='Sức khỏe' >Sức khỏe</option>
                        <option value='Nhà ở' >Nhà ở</option>
                        <option value='Đi lại' >Đi lại</option>
                        <option value='Giải trí' >Giải trí</option>
                        <option value='Mua sắm' >Mua sắm</option>
                        <option value='Chi tiêu khác' >Chi tiêu khác</option>
                        <option value='Lương' >Lương</option>
                        <option value='Thu nhập khác' >Thu nhập khác</option>
                    </select>
                    <label htmlFor='money-range' >Phạm vi tiền:</label>
                    <input type='number' placeholder='Tối thiểu' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                    }} value={minPrice} onChange={handleMinPrice} />
                    <input type='number' placeholder='Tối đa' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                    }} value={maxPrice} onChange={handleMaxPrice} />
                    <label htmlFor='time-range' >Thời gian:</label>
                    <input type='date' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                    }} value={startDate} onChange={handleStartDate} />
                    <input type='date' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                    }} value={endDate} onChange={handleEndDate} />
                </section>
            </div>
            <div className={styles['trans-region']} >
                <strong>Giao dịch</strong>
                <hr />
                <ul className={styles['trans-list']} style={{ listStyle: 'none' }} >
                    {filteredTransList.map((item, index) => (
                        <li key={item.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '30px 350px 110px 180px 220px 210px 50px',
                            marginLeft: '-40px',
                            border: '2px solid rgb(0, 117, 70)',
                            borderRadius: '20px',
                            paddingLeft: '5px',
                            marginBottom: '5px',
                            height: '50px',
                        }}>
                            <p><strong>{index + 1}</strong></p>
                            <p>{item.note}</p>
                            <p><img style={{ width: '30px', marginTop: '-5px' }} src={item.categoryIcon} /></p>
                            <p>{item.category}</p>
                            <p style={item.type === 'Thu nhập' ? { color: 'green' } : { color: 'red' }}>
                                {item.type === 'Thu nhập' ? `+ ` : `- `}{`${item.amount} đ`}
                            </p>
                            <p>{item.date}</p>
                            <input type={addEdit === 2 ? 'radio' : 'checkbox'}
                                // Tách luồng tránh xung đột
                                name={addEdit === 2 ? 'edit-item' : 'delete-item'}
                                value={item.id}
                                className={styles['t-checkbox']}
                                // Đang sửa thì dùng editingId, ngược lại dùng mảng selectedIds
                                checked={addEdit === 2 ? editingId === item.id : selectedIds.includes(item.id)}
                                // Ghi nhớ: checked={false} sẽ khiến checkbox không bị tick
                                // React quan tâm cả giá trị đằng sau, không như HTML
                                onChange={() => {
                                    if (addEdit === 2) {
                                        handleRadioChange(item.id);
                                    } else {
                                        handleCheckboxChange(item.id);
                                    }
                                }}
                            />
                        </li>
                    ))}
                </ul>
                {addEdit === 1 && <div className={styles['addingnew-section']}>
                    <p><strong>Thêm giao dịch mới</strong></p>
                    <input type='text' value={newNote} onChange={(e) => setNewNote(e.target.value)} style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                        width: '325px',
                    }} placeholder='Tên giao dịch mới' />
                    <select name='type-select' id='type-select' className={styles['filt-selector']} value={typeSelect} onChange={handleTypeSelect} >
                        <option value='income' >Thu nhập</option>
                        <option value='expense'>Chi phí</option>
                    </select>
                    <select name='category-select' id='category-select' style={{ width: '120px' }} className={styles['filt-selector']} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} >
                        {typeSelect === 'expense' ? (<div>
                            <option value='Ăn uống' >Ăn uống</option>
                            <option value='Đơn điện tử' >Đơn điện tử</option>
                            <option value='Sức khỏe' >Sức khỏe</option>
                            <option value='Nhà ở' >Nhà ở</option>
                            <option value='Đi lại' >Đi lại</option>
                            <option value='Giải trí' >Giải trí</option>
                            <option value='Mua sắm' >Mua sắm</option>
                            <option value='Chi tiêu khác' >Chi tiêu khác</option>
                        </div>) : (<div>
                            <option value='Lương' >Lương</option>
                            <option value='Thu nhập khác' >Thu nhập khác</option>
                        </div>)}
                    </select>
                    <input type='text' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                    }} placeholder='Số tiền' value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                    <input type='date' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                    }} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    <button className={styles['func-button']} onClick={handleConfirmAdd} >Thêm giao dịch</button>
                </div>}
                {addEdit === 2 && <div className={styles['editting-section']} >
                    <p><strong>Sửa giao dịch hiện tại</strong></p>
                    {!editingId ? (
                        <p style={{ color: 'green' }}>Vui lòng bấm chọn vào ô tròn bên cạnh 1 giao dịch để sửa.</p>
                    ) : (<>
                        <input type='text' style={{
                            border: '2px solid rgb(0, 117, 70)',
                            borderRadius: '20px',
                            height: '22px',
                            marginTop: '-4px',
                            marginRight: '10px',
                            paddingLeft: '5px',
                            width: '325px',
                        }} placeholder='Sửa tên giao dịch' value={editedNote} onChange={(e) => setEditedNote(e.target.value)} />
                        <select name='type-select' id='type-select' className={styles['filt-selector']} value={typeSelect} onChange={handleTypeSelect} >
                            <option value='income' >Thu nhập</option>
                            <option value='expense'>Chi phí</option>
                        </select>
                        <select name='category-select' id='category-select' style={{ width: '120px' }} className={styles['filt-selector']} value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} >
                            {typeSelect === 'expense' ? (<>
                                <option value='Ăn uống' >Ăn uống</option>
                                <option value='Đơn điện tử' >Đơn điện tử</option>
                                <option value='Sức khỏe' >Sức khỏe</option>
                                <option value='Nhà ở' >Nhà ở</option>
                                <option value='Đi lại' >Đi lại</option>
                                <option value='Giải trí' >Giải trí</option>
                                <option value='Mua sắm' >Mua sắm</option>
                                <option value='Chi tiêu khác' >Chi tiêu khác</option>
                            </>) : (<>
                                <option value='Lương' >Lương</option>
                                <option value='Thu nhập khác' >Thu nhập khác</option>
                            </>)}
                        </select>
                        <input type='text' style={{
                            border: '2px solid rgb(0, 117, 70)',
                            borderRadius: '20px',
                            height: '22px',
                            marginTop: '-4px',
                            marginRight: '10px',
                            paddingLeft: '5px',
                        }} placeholder='Số tiền' value={editedAmount} onChange={(e) => setEditedAmount(e.target.value)} />
                        <input type='date' style={{
                            border: '2px solid rgb(0, 117, 70)',
                            borderRadius: '20px',
                            height: '22px',
                            marginTop: '-4px',
                            marginRight: '10px',
                            paddingLeft: '5px',
                        }} value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />
                        <button className={styles['func-button']} onClick={handleConfirmEdit} >Sửa giao dịch</button>
                        <button onClick={() => setEditingId(null)} className={styles['func-button']} >Hủy chọn</button>
                    </>
                    )}
                </div>}
            </div>
            <div className={styles['func-list']} >
                <section className={styles['func-region']} >
                    <strong style={{ marginRight: '20px' }} >Chức năng</strong>
                    <button className={styles['func-button']} onClick={handleAddButton} >Thêm mới</button>
                    <button className={styles['func-button']} onClick={handleEditButton} >Sửa giao dịch</button>
                    <button className={addEdit === 2 ? styles['delete-button-unactive'] : styles['delete-button']} onClick={handleDeleteSelected} disabled={addEdit === 2} >Xóa</button>
                    <button className={addEdit === 2 ? styles['tickall-button-unactive'] : styles['tickall-button']} onClick={handleSelectAll} disabled={addEdit === 2} >Chọn hết</button>
                    <button className={addEdit === 2 ? styles['untickall-button-unactive'] : styles['untickall-button']} onClick={handleUnselectedAll} disabled={addEdit === 2} >Bỏ chọn hết</button>
                    <label htmlFor='sorter' style={{ marginLeft: '10px', marginRight: '10px' }} >Sắp xếp:</label>
                    <select name='sorter' id='sorter' className={styles['filt-selector']} >
                        <option value='none' >Không sắp xếp</option>
                        <option value='date' >Theo ngày (cũ → mới)</option>
                        <option value='reverse-date' >Theo ngày (mới → cũ)</option>
                        <option value='price' >Theo tiền (ít → nhiều)</option>
                        <option value='reverse-price' >Theo tiền (nhiều → ít)</option>
                        <option value='az' >Theo chữ cái (a → z)</option>
                        <option value='reverse-az' >Theo chữ cái (z → a)</option>
                    </select>
                    <label htmlFor='searcher' style={{ marginLeft: '10px', marginRight: '10px' }} >Tìm kiếm:</label>
                    <input type='text' style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        height: '22px',
                        marginTop: '-4px',
                        marginRight: '10px',
                        paddingLeft: '5px',
                        width: '230px',
                    }} placeholder='Nhập tên giao dịch' />
                </section>
            </div>
        </div>
    )
}
