import { useMemo } from 'react';
import styles from './transactions.module.css'
import { useState, useEffect } from 'react';

export function Transactions() {
    const [transList, setTransList] = useState([]);
    const [typeSelect, setTypeSelect] = useState('income');
    const [typeSelectNew, setTypeSelectNew] = useState('all-category');
    const [addEdit, setAddEdit] = useState(0);
    const [filterCategories, setFilterCategories] = useState([]); // Danh sách danh mục dùng riêng cho Bộ lọc
    // SetState là bất đồng bộ, khi setState(newValue), React không cập nhật val đó ngay.
    // Nó sẽ đưa vào 1 hàng đợi trước. Vì thế nếu dùng ngay sau khi gọi hàm set, giá trị vẫn là cũ.
    // Không nên viết logic lọc bên trong hàm xử lý thay đổi.

    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error("Chưa có token, hủy fetch");
            return; // Dừng lại nếu chưa thấy token
        }
        if (token) {
            fetch(`http://localhost:5000/api/transactions`, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    // Đây là phần quan trọng nhất: Gửi chìa khóa cho Backend
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Dữ liệu nhận về:", data);

                    // KIỂM TRA: Backend này trả về { success: true, data: [...] }
                    // nên bạn phải set đúng vào mảng nằm bên trong nó
                    if (data.success && Array.isArray(data.data)) {
                        setTransList(data.data);
                    } else {
                        console.error("Dữ liệu không đúng định dạng mảng:", data);
                        setTransList([]); // Tránh lỗi .map()
                    }
                })
                .catch(err => console.error("Đã xảy ra lỗi!: ", err));
        } else {
            console.warn("Không tìm thấy Token. Vui lòng đăng nhập lại.");
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('userToken');

        // Tạo link fetch: Nếu lọc 'Tất cả các loại' thì lấy hết, nếu chọn cụ thể thì fetch theo loại đó
        const fetchUrl = typeSelectNew === 'all-category'
            ? `http://localhost:5000/api/categories`
            : `http://localhost:5000/api/categories?type=${typeSelectNew}`;

        fetch(fetchUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setFilterCategories(result.data);
                }
            })
            .catch(err => console.error("Lỗi fetch danh mục bộ lọc:", err));
    }, [typeSelectNew]); // Chạy lại khi người dùng đổi Loại ở Bộ lọc

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        // Fetch categories dựa trên loại (income/expense) đang chọn trong Form
        fetch(`http://localhost:5000/api/categories?type=${typeSelect}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setCategories(result.data);
                    // Tự động chọn ID đầu tiên làm mặc định cho Form
                    if (result.data.length > 0) {
                        if (addEdit === 1) setNewCategory(result.data[0]._id);
                        if (addEdit === 2) setEditedCategory(result.data[0]._id);
                    }
                }
            });
    }, [typeSelect, addEdit]); // Chạy lại khi đổi loại thu/chi hoặc mở form

    const [chosenCategory, setChosenCategory] = useState('all-category');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sorterFunc, setSorterFunc] = useState('none');
    const [search, setSearch] = useState('');

    // Sao chép mảng bằng Spread Operator
    const rearrangedTransList = [...transList];

    /* switch (sorterFunc) {
        case 'date':
            rearrangedTransList.sort((a, b) => {
                const dateA = new Date(a.date.slice(6, 10) + '-' + a.date.slice(3, 5) + '-' + a.date.slice(0, 2)).getTime();
                const dateB = new Date(b.date.slice(6, 10) + '-' + b.date.slice(3, 5) + '-' + b.date.slice(0, 2)).getTime();
                return dateA - dateB;
            });
            break;
        case 'reverse-date':
            rearrangedTransList.sort((a, b) => {
                const dateA = new Date(a.date.slice(6, 10) + '-' + a.date.slice(3, 5) + '-' + a.date.slice(0, 2)).getTime();
                const dateB = new Date(b.date.slice(6, 10) + '-' + b.date.slice(3, 5) + '-' + b.date.slice(0, 2)).getTime();
                return dateB - dateA;
            });
            break;
        case 'price':
            rearrangedTransList.sort((a, b) => {
                const priceA = Number(a.amount);
                const priceB = Number(b.amount);
                return priceA - priceB;
            });
            break;
        case 'reverse-price':
            rearrangedTransList.sort((a, b) => {
                const priceA = Number(a.amount);
                const priceB = Number(b.amount);
                return priceB - priceA;
            });
            break;
        case 'az':
            rearrangedTransList.sort((a, b) => {
                return a.note.localeCompare(b.note);
            });
            break;
        case 'reverse-az':
            rearrangedTransList.sort((a, b) => {
                return b.note.localeCompare(a.note);
            });
            break;
        default:
            break;
    }

    const filteredTransList = rearrangedTransList.filter(item => {
        const matchCategory = (chosenCategory === 'all-category' || item.category === chosenCategory);

        const price = Number(item.amount);
        const matchPrice = (!minPrice || price >= Number(minPrice)) && (!maxPrice || price <= Number(maxPrice));

        const dateToCompare = item.date.slice(6, 10) + '-' + item.date.slice(3, 5) + '-' + item.date.slice(0, 2);
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const iDate = new Date(dateToCompare);
        const matchDate = (!sDate.getTime() || iDate.getTime() >= sDate.getTime()) && (!eDate.getTime() || iDate.getTime() <= eDate.getTime());

        const removeAccents = (str) => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        // Trong filter:
        const searchTerm = removeAccents(search.toLowerCase());
        const itemNote = removeAccents(item.note.toLowerCase());

        const matchSearch = itemNote.startsWith(searchTerm);

        return matchCategory && matchPrice && matchDate && matchSearch;
    }); */

    const filteredTransList = useMemo(() => {
        let modifiedList = [...transList];

        switch (sorterFunc) {
            case 'date':
                modifiedList.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'reverse-date':
                modifiedList.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'price':
                modifiedList.sort((a, b) => Number(a.amount) - Number(b.amount));
                break;
            case 'reverse-price':
                modifiedList.sort((a, b) => Number(b.amount) - Number(a.amount));
                break;
            case 'az':
                modifiedList.sort((a, b) => (a.note || "").localeCompare(b.note || ""));
                break;
            case 'reverse-az':
                modifiedList.sort((a, b) => (b.note || "").localeCompare(a.note || ""));
                break;
            default:
                break;
        }

        return modifiedList.filter(item => {
            const matchType = (typeSelectNew === 'all-category' || item.type === typeSelectNew);

            const matchCategory = (chosenCategory === 'all-category' || item.categoryId?._id === chosenCategory);

            const price = Number(item.amount);
            const matchPrice = (!minPrice || price >= Number(minPrice)) && (!maxPrice || price <= Number(maxPrice));

            const iDate = new Date(item.date);
            const sDate = startDate ? new Date(startDate) : null;
            const eDate = endDate ? new Date(endDate) : null;
            const matchDate = (!sDate || iDate >= sDate) && (!eDate || iDate <= eDate);

            const removeAccents = (str) => {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }

            // Trong filter:
            const searchTerm = removeAccents(search.toLowerCase());
            const matchSearch = removeAccents((item.note || "").toLowerCase()).includes(searchTerm);

            return matchType && matchCategory && matchPrice && matchDate && matchSearch;
        });

    }, [transList, sorterFunc, typeSelectNew, chosenCategory, minPrice, maxPrice, startDate, endDate, search])

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

    const handleAddButton = () => setAddEdit(addEdit === 1 ? 0 : 1);
    const handleEditButton = () => setAddEdit(addEdit === 2 ? 0 : 2);

    const handleTypeSelect = (e) => {
        setTypeSelect(e.target.value);
    };

    const handleTypeSelectNew = (e) => {
        setTypeSelectNew(e.target.value);
        setChosenCategory('all-category');
    };

    const [newNote, setNewNote] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState(''); // Lưu Id của Category thay vì tên

    // Tự động cập nhật danh mục mặc định khi thay đổi loại giao dịch (Thu nhập <-> Chi phí)
    // Hàm này sẽ chạy mỗi khi typeSelect thay đổi

    const handleConfirmAdd = () => {
        if (!newNote || !newAmount || !newDate || !newCategory) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("Phiên đăng nhập hết hạn!");
            return;
        }

        const newTransaction = {
            type: typeSelect,        // 'income' hoặc 'expense'
            amount: Number(newAmount),
            date: newDate,           // Backend chấp nhận định dạng YYYY-MM-DD từ input date
            note: newNote,
            categoryId: newCategory  // Lấy ID từ state đã chọn trong dropdown
        };

        fetch('http://localhost:5000/api/transactions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newTransaction)
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    // Cập nhật danh sách: Thêm phần tử mới vào đầu mảng
                    setTransList([resData.data, ...transList]);
                    setAddEdit(0);
                    // Reset form
                    setNewNote(''); setNewAmount(''); setNewDate('');
                    alert("Đã thêm giao dịch!");
                } else {
                    alert("Lỗi: " + resData.message);
                }
            })
            .catch(err => console.error("Lỗi khi thêm:", err));
    }

    const [editingId, setEditingId] = useState(null);
    const [editedNote, setEditedNote] = useState('');
    const [editedAmount, setEditedAmount] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [editedCategory, setEditedCategory] = useState('');

    // Hàm xử lý khi 1 radio button được chọn
    const handleRadioChange = (id) => {
        setEditingId(id);
        const itemToEdit = transList.find(item => item._id === id);
        if (itemToEdit) {
            // Đổ dữ liệu hiện tại vào form
            setEditedNote(itemToEdit.note);
            setEditedAmount(itemToEdit.amount);
            setEditedDate(new Date(itemToEdit.date).toISOString().split('T')[0]);
            setTypeSelect(itemToEdit.type);
            setEditedCategory(itemToEdit.categoryId?._id); // Lưu ID để update
        }
    };

    /* useEffect(() => {
        if (addEdit === 2 && editingId) { // Chỉ chạy khi đang ở chế độ sửa
            if (typeSelect === 'expense') {
                setEditedCategory('Ăn uống');
            } else {
                setEditedCategory('Lương');
            }
        }
    }, [typeSelect, addEdit]); */

    const handleConfirmEdit = () => {
        if (!editingId) return;

        const token = localStorage.getItem('userToken');
        const updatedTransaction = {
            type: typeSelect,
            amount: Number(editedAmount),
            date: editedDate,
            note: editedNote,
            categoryId: editedCategory
        };

        fetch(`http://localhost:5000/api/transactions/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedTransaction),
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    // Tìm và thay thế phần tử đã sửa trong mảng state
                    setTransList(transList.map(item => item._id === editingId ? resData.data : item));
                    setAddEdit(0);
                    setEditingId(null);
                    alert("Cập nhật thành công!");
                }
            })
            .catch(err => console.error("Lỗi khi sửa:", err));
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
        const allFilteredIds = filteredTransList.map(item => item._id);
        setSelectedIds(allFilteredIds);
    };

    // Bỏ chọn tất cả
    const handleUnselectedAll = () => {
        setSelectedIds([]);
    }

    // Hàm xóa
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một giao dịch để xóa!");
            return;
        }

        if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} giao dịch?`)) {
            const token = localStorage.getItem('userToken');
            try {
                // Chạy tất cả các yêu cầu xóa cùng lúc
                const deletePromises = selectedIds.map(id =>
                    fetch(`http://localhost:5000/api/transactions/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                );

                await Promise.all(deletePromises);

                // Cập nhật UI: Chỉ giữ lại các mục KHÔNG nằm trong danh sách vừa xóa
                setTransList(transList.filter(item => !selectedIds.includes(item._id)));
                setSelectedIds([]);
                alert("Đã xóa thành công!");
            } catch (err) {
                console.error("Lỗi xóa:", err);
                alert("Có lỗi xảy ra khi xóa.");
            }
        }
    }

    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['filter']} >
                <section className={styles['filter-region']}>
                    <strong>Bộ lọc</strong>

                    {/* 1. Lọc theo Loại (Thu nhập/Chi phí/Tất cả) */}
                    <label htmlFor='type-sel'>Loại:</label>
                    <select
                        name='type-sel'
                        id='type-sel'
                        className={styles['filt-selector']}
                        value={typeSelectNew}
                        onChange={handleTypeSelectNew}
                    >
                        <option value='all-category'>Tất cả các loại</option>
                        <option value='income'>Thu nhập</option>
                        <option value='expense'>Chi phí</option>
                    </select>

                    {/* 2. Lọc theo Danh mục (Chỉ cần 1 select duy nhất) */}
                    <label htmlFor='category'>Danh mục:</label>
                    <select
                        name='category'
                        id='category'
                        className={styles['filt-selector']}
                        value={chosenCategory}
                        onChange={handleSelectChange}
                    >
                        <option value='all-category'>Tất cả danh mục</option>
                        {filterCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name} {/* Hiển thị tên danh mục */}
                            </option>
                        ))}
                    </select>

                    {/* 3. Phạm vi tiền */}
                    <label>Phạm vi tiền:</label>
                    <input
                        type='number'
                        placeholder='Tối thiểu'
                        className={styles['input-field']}
                        value={minPrice}
                        onChange={handleMinPrice}
                    />
                    <input
                        type='number'
                        placeholder='Tối đa'
                        className={styles['input-field']}
                        value={maxPrice}
                        onChange={handleMaxPrice}
                    />

                    {/* 4. Khoảng thời gian */}
                    <label>Thời gian:</label>
                    <input
                        type='date'
                        className={styles['input-field']}
                        value={startDate}
                        onChange={handleStartDate}
                    />
                    <input
                        type='date'
                        className={styles['input-field']}
                        value={endDate}
                        onChange={handleEndDate}
                    />
                </section>
            </div>
            <div className={styles['trans-region']} >
                <strong>Giao dịch</strong>
                <hr />
                <ul className={styles['trans-list']} style={{ listStyle: 'none' }} >
                    {filteredTransList.map((item, index) => (
                        <li key={item._id} style={{
                            display: 'grid',
                            gridTemplateColumns: '30px 350px 180px 220px 210px 50px',
                            marginLeft: '-40px',
                            border: '2px solid rgb(0, 117, 70)',
                            borderRadius: '20px',
                            paddingLeft: '5px',
                            marginBottom: '5px',
                            height: '50px',
                        }}>
                            <p><strong>{index + 1}</strong></p>
                            <p>{item.note}</p>
                            <p>{item.categoryId?.name}</p>
                            <p style={item.type === 'income' ? { color: 'green' } : { color: 'red' }}>
                                {item.type === 'income' ? `+ ` : `- `}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                            </p>
                            <p>{new Date(item.date).toLocaleDateString('vi-VN')}</p>
                            <input type={addEdit === 2 ? 'radio' : 'checkbox'}
                                // Tách luồng tránh xung đột
                                name={addEdit === 2 ? 'edit-item' : 'delete-item'}
                                value={item._id}
                                className={styles['t-checkbox']}
                                // Đang sửa thì dùng editingId, ngược lại dùng mảng selectedIds
                                checked={addEdit === 2 ? editingId === item._id : selectedIds.includes(item._id)}
                                // Ghi nhớ: checked={false} sẽ khiến checkbox không bị tick
                                // React quan tâm cả giá trị đằng sau, không như HTML
                                onChange={() => {
                                    if (addEdit === 2) {
                                        handleRadioChange(item._id);
                                    } else {
                                        handleCheckboxChange(item._id);
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
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input type='number' style={{
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
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <input type='number' style={{
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
                    <select name='sorter' id='sorter' className={styles['filt-selector']} value={sorterFunc} onChange={(e) => setSorterFunc(e.target.value)} >
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
                    }} placeholder='Nhập tên giao dịch' value={search} onChange={(e) => setSearch(e.target.value)} />
                </section>
            </div>
        </div>
    )
}