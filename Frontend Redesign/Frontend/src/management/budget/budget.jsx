import styles from './budget.module.css'
import { useState, useEffect } from 'react'

export function Budget() {
    /* Tạo useState -> gắn hàm set vào handle -> gắn hàm handle vào onChange */
    const [budgetsList, setBudgetsList] = useState([]);
    const [iconsMap, setIconsMap] = useState({});
    const [activeFunc, setActiveFunc] = useState(0);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        if (currentUserId) {
            fetch(`http://localhost:8080/api/budgetslist?userId=${currentUserId}`)
                .then(res => res.json())
                .then(data => {
                    setBudgetsList(data);
                })
                .catch(err => console.error("Đã xảy ra lỗi!: ", err));
        }
    }, [currentUserId]);

    useEffect(() => {
        fetch("http://localhost:8080/api/iconslist")
            .then(res => res.json())
            .then(data => {
                setIconsMap(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    const handleAddButton = () => {
        if (activeFunc === 1) {
            setActiveFunc(0);
        } else {
            setActiveFunc(1);
        }
    };

    /* Đặt hàm handle vào thuộc tính onClick của Button */

    const [filtMonth, setFiltMonth] = useState('all-months');

    const handleFiltMonthChange = (e) => {
        setFiltMonth(e.target.value);
    };

    const [filtYear, setFiltYear] = useState('');

    const handleFiltYearChange = (e) => {
        setFiltYear(e.target.value);
    }

    const [filtState, setFiltState] = useState('all-states');

    const handleFiltStateChange = (e) => {
        setFiltState(e.target.value);
    }

    const filteredBudgetsList = budgetsList.filter(item => {
        const matchMonth = (filtMonth === 'all-months' || Number(item.month.substring(6)) === Number(filtMonth));

        const matchYear = (filtYear === '' || Number(item.year) === Number(filtYear));

        const stateForComparison = item.isActive ? 'active' : 'non-active';
        const matchState = (filtState === 'all-states' || stateForComparison === filtState);

        return matchMonth && matchYear && matchState;
    });

    /* Thứ tự hoạt động: Người dùng click -> onChange kích hoạt -> hàm handle cập nhật state */
    /* React re-render lại component -> cập nhật lại checked (hàm sau có true hay không) */

    const [newCategory, setNewCategory] = useState('Ăn uống');
    const [newMonth, setNewMonth] = useState('01');
    const [newYear, setNewYear] = useState(`${new Date().getFullYear()}`);
    const [newLimitAmount, setNewLimitAmount] = useState(0);
    const [newAlertThreshold, setNewAlertThreshold] = useState(70);
    const [newIsActive, setNewIsActive] = useState(true);

    const handleConfirmAdd = () => {
        if (!newYear || newLimitAmount === 0) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (!currentUserId) {
            alert("Không tìm thấy thông tin người dùng!");
            return;
        }

        const newBudget = {
            userId: currentUserId, // <<< Added UserID
            bid: `${newYear.substring(2, 4)}_${newMonth}`,
            category: newCategory,
            month: `Tháng ${newMonth.substring(0, 1) === '0' ? newMonth.substring(1) : newMonth}`,
            year: newYear,
            limitAmount: newLimitAmount,
            alertThreshold: newAlertThreshold,
            isActive: newIsActive === 'active'
        }

        fetch('http://localhost:8080/api/add-budget', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBudget)
        })
            .then(res => res.json())
            .then(updatedData => {
                setBudgetsList(updatedData);
                setActiveFunc(0);
                setNewCategory('Ăn uống');
                setNewMonth('01');
                setNewYear(`${new Date().getFullYear()}`);
                setNewLimitAmount(0);
                setNewAlertThreshold(70);
                setNewIsActive(true);
                alert("Đã thêm ngân sách!");
            })
            .catch(err => console.error("Lỗi khi thêm: ", err));
    };

    const [edittingId, setEdittingId] = useState(null);
    const [edittedBid, setEdittedBid] = useState('');
    const [edittedCategory, setEdittedCategory] = useState('Ăn uống');
    const [edittedMonth, setEdittedMonth] = useState('01');
    const [edittedYear, setEdittedYear] = useState(`${new Date().getFullYear()}`);
    const [edittedLimitAmount, setEdittedLimitAmount] = useState(0);
    const [edittedAlertThreshold, setEdittedAlertThreshold] = useState(70);
    const [edittedIsActive, setEdittedIsActive] = useState(true);

    const handleEditButton = (id) => {
        if (activeFunc === 2) {
            setActiveFunc(0);
            setEdittingId(null);
        } else {
            setActiveFunc(2);
            setEdittingId(id);
            const itemToEdit = budgetsList.find(item => item._id === id);
            if (itemToEdit) {
                setEdittedBid(itemToEdit.bid);
                setEdittedCategory(itemToEdit.category);
                setEdittedMonth(Number(itemToEdit.month.substring(6)) >= 10 ? `${itemToEdit.month.substring(6)}` : `0${itemToEdit.month.substring(6)}`);
                setEdittedYear(itemToEdit.year.toString());
                setEdittedLimitAmount(itemToEdit.limitAmount);
                setEdittedAlertThreshold(itemToEdit.alertThreshold);
                setEdittedIsActive(itemToEdit.isActive === true ? 'active' : 'non-active');
            }
        }
    };

    const handleConfirmEdit = () => {
        if (!edittingId) {
            alert("Vui lòng chọn ngân sách để sửa!")
            return;
        }

        const updatedBudget = {
            userId: currentUserId, // <<< Added UserID
            bid: edittedBid,
            category: edittedCategory,
            month: `Tháng ${edittedMonth.substring(0, 1) === '0' ? edittedMonth.substring(1) : edittedMonth}`,
            year: edittedYear,
            limitAmount: edittedLimitAmount,
            alertThreshold: edittedAlertThreshold,
            isActive: edittedIsActive === 'active' /* Ép 1 phép so sánh để trả về kiểu boolean (data nguyên thủy) */
        }

        const prefix = `${edittedYear.substring(2, 4)}_${edittedMonth}`;

        updatedBudget['bid'] = `${prefix}`

        fetch(`http://localhost:8080/api/update-budget/${edittingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBudget),
        })
            .then(res => res.json())
            .then(updatedData => {
                setBudgetsList(updatedData)
                setActiveFunc(0);
                setEdittedCategory('Ăn uống');
                setEdittedMonth('01');
                setEdittedYear(`${new Date().getFullYear()}`);
                setEdittedLimitAmount(0);
                setEdittedAlertThreshold(70);
                setEdittedIsActive(true);
                alert("Đã chỉnh sửa ngân sách!");
            })
            .catch(err => console.error("Lỗi khi sửa: ", err));
    };

    const handleDeleteButton = (id) => {
        // Bỏ hàm setDeletedId đi, không dùng đồng thời deletedId do State bất đồng bộ

        if (window.confirm('Xóa giao dịch này?')) {
            fetch('http://localhost:8080/api/delete-budget', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: id,
                    userId: currentUserId
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error("Lỗi khi xóa từ server!");
                    return res.json();
                })
                .then(updatedData => {
                    setBudgetsList(updatedData);
                    alert('Xóa thành công!');
                })
                .catch(err => {
                    console.error("Lỗi xóa:", err);
                    alert("Không thể xóa giao dịch, vui lòng thử lại.");
                });
        }
    };

    const handleDeleteAllButton = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa TẤT CẢ ngân sách? Hành động này không thể hoàn tác!')) {
            fetch('http://localhost:8080/api/delete-all-budgets', {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUserId
                })
            })
                .then(res => {
                    if (!res.ok) throw new Error("Lỗi khi xóa từ server!");
                    return res.json();
                })
                .then(updatedData => {
                    setBudgetsList(updatedData);
                    alert('Xóa thành công!');
                })
                .catch(err => {
                    console.error("Lỗi xóa:", err);
                    alert("Không thể xóa giao dịch, vui lòng thử lại.");
                });
        }
    };

    return (
        <div>
            <h4 style={{ marginTop: '-1px' }} >Ngân sách</h4>
            <hr style={{ marginTop: '-10px' }} />
            <section className={styles['outer-boundary']} >
                <div className={styles['budget-region']} >
                    <section className={styles['filter-section']} >
                        <p style={{ color: 'rgb(69, 74, 73)', display: 'inline', marginRight: '20px' }} ><strong>Bộ lọc</strong></p>
                        <label htmlFor='month' >Tháng</label>
                        <select name='month' id='month' className={styles['filt-selector']} style={{ width: '100px' }} value={filtMonth} onChange={handleFiltMonthChange} >
                            <option value='all-months' >Tất cả tháng</option>
                            <option value='01' >Tháng 1</option>
                            <option value='02' >Tháng 2</option>
                            <option value='03' >Tháng 3</option>
                            <option value='04' >Tháng 4</option>
                            <option value='05' >Tháng 5</option>
                            <option value='06' >Tháng 6</option>
                            <option value='07' >Tháng 7</option>
                            <option value='08' >Tháng 8</option>
                            <option value='09' >Tháng 9</option>
                            <option value='10' >Tháng 10</option>
                            <option value='11' >Tháng 11</option>
                            <option value='12' >Tháng 12</option>
                        </select>
                        <label htmlFor='year' >Năm</label>
                        <input type='number' name='year' id='year' className={styles['input-field']} value={filtYear} onChange={handleFiltYearChange} />
                        <label htmlFor='bstate' >Trạng thái</label>
                        <select name='bstate' id='bstate' className={styles['filt-selector']} style={{ width: '130px' }} value={filtState} onChange={handleFiltStateChange} >
                            <option value='all-states'>Tất cả trạng thái</option>
                            <option value='active' >Hoạt động</option>
                            <option value='non-active' >Không hoạt động</option>
                        </select>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                    <section className={styles['budgs-list-region']} >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '45px 205px 75px 77px 100px 153px 161px 160px',
                            backgroundColor: 'white',
                            border: '2px solid rgb(167, 167, 167)',
                            borderRadius: '15px',
                            color: 'rgb(94, 94, 94)',
                            fontSize: '14px',
                            marginLeft: '17px',
                            marginRight: '17px',
                            height: '30px',
                            paddingLeft: '5px',
                            alignItems: 'center',
                            /* dùng align items để căn giữa theo trục dọc */
                        }} >
                            <p style={{ margin: 0 }} ><strong>STT</strong></p>
                            {/* Đặt margin về 0 để tránh căn lề mặc định của p */}
                            <p style={{ margin: 0 }} ><strong>Danh mục</strong></p>
                            <p style={{ margin: 0 }} ><strong>Tháng</strong></p>
                            <p style={{ margin: 0 }} ><strong>Năm</strong></p>
                            <p style={{ margin: 0 }} ><strong>Hạn mức</strong></p>
                            <p style={{ margin: 0 }} ><strong>Ngưỡng cảnh báo</strong></p>
                            <p style={{ margin: 0 }} ><strong>Trạng thái</strong></p>
                            <p style={{ margin: 0 }} ><strong>Đã dùng</strong></p>
                        </div>
                        <div className={styles['bsl-boundary']} >
                            <ul className={styles['budgs-list']} style={{ listStyle: 'none' }} >
                                {filteredBudgetsList.map((item, index) => (
                                    <li key={item._id} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '30px 50px 160px 75px 80px 150px 100px 160px 140px 48px 48px',
                                        gridAutoRows: '35px',
                                        border: '2px solid rgb(0, 117, 70)',
                                        borderRadius: '20px',
                                        backgroundColor: 'white',
                                        paddingLeft: '15px',
                                        marginBottom: '5px'
                                    }} >
                                        <p><strong>{index + 1}</strong></p>
                                        <p><img style={{ width: '30px', marginTop: '-6px' }} src={`http://localhost:8080/api/images/${iconsMap[item.category]}.png`} /></p>
                                        <p>{item.category}</p>
                                        <p>{item.month}</p>
                                        <p>{item.year}</p>
                                        <p>{item.limitAmount}</p>
                                        <p>{item.alertThreshold}</p>
                                        {item.isActive === true ?
                                            <p style={{ color: 'green' }} ><strong>Hoạt động</strong></p> :
                                            <p style={{ color: 'grey' }} ><strong>Không hoạt động</strong></p>}
                                        <p>{item.amountConsumed}</p>
                                        <button className={styles['budg-button']} style={{ width: '45px', marginTop: '9px', marginBottom: '-3px' }} onClick={() => handleEditButton(item._id)} >Sửa</button>
                                        <button className={styles['budg-button']} style={{ width: '45px', marginTop: '9px', marginBottom: '-3px' }} onClick={() => handleDeleteButton(item._id)} >Xóa</button>
                                        {item.isActive === true ?
                                            <div style={{
                                                width: '300px',
                                                height: '15px',
                                                backgroundColor: ((item.amountConsumed / item.limitAmount) <= 0.3) ? 'rgb(217, 239, 233)' :
                                                    ((item.amountConsumed / item.limitAmount) <= 0.6) ? 'rgb(239, 236, 217)' : 'rgb(239, 217, 217)',
                                                border: ((item.amountConsumed / item.limitAmount) <= 0.3) ? '2px solid rgb(46, 158, 115)' :
                                                    ((item.amountConsumed / item.limitAmount) <= 0.6) ? '2px solid rgb(158, 130, 46)' : '2px solid rgb(158, 46, 46)',
                                                borderRadius: '20px',
                                                marginTop: '10px',
                                                overflow: 'hidden',
                                            }} >
                                                <div style={{
                                                    width: `${(item.amountConsumed / item.limitAmount) * 100}%`,
                                                    height: '100%',
                                                    backgroundColor: ((item.amountConsumed / item.limitAmount) <= 0.3) ? 'rgb(46, 158, 115)' :
                                                        ((item.amountConsumed / item.limitAmount) <= 0.6) ? 'rgb(158, 130, 46)' : 'rgb(158, 46, 46)',
                                                    borderRadius: '20px',
                                                }} ></div>
                                            </div> :
                                            <div style={{
                                                width: '300px',
                                                height: '15px',
                                                backgroundColor: 'rgb(205, 205, 205)',
                                                border: '2px solid rgb(174, 174, 174)',
                                                borderRadius: '20px',
                                                marginTop: '10px'
                                            }} ></div>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                    <hr style={{ marginTop: '3px' }} />
                    <section className={styles['budg-button-region']} >
                        <div>
                            <button className={styles['budg-button']} style={{ width: '100px', height: '27px' }} onClick={handleAddButton} >Thêm mới</button>
                            <br />
                            <button className={styles['budg-button']} style={{ width: '100px', height: '27px' }} onClick={handleDeleteAllButton}  >Xóa tất cả</button>
                        </div>
                        <div style={{
                            borderLeft: '1px solid rgb(167, 167, 167)',
                            height: '92px',
                            marginTop: '-9px'
                        }} ></div>
                        <div >
                            {activeFunc === 1 && <div>
                                <label htmlFor='sel-category'>Danh mục:</label>
                                <select name='sel-category' id='sel-category' className={styles['filt-selector']} style={{ width: '120px' }} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} >
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
                                <label htmlFor='sel-month'>Tháng:</label>
                                <select name='sel-month' id='sel-month' className={styles['filt-selector']} style={{ width: '85px' }} value={newMonth} onChange={(e) => setNewMonth(e.target.value)} >
                                    <option value='01' >Tháng 1</option>
                                    <option value='02' >Tháng 2</option>
                                    <option value='03' >Tháng 3</option>
                                    <option value='04' >Tháng 4</option>
                                    <option value='05' >Tháng 5</option>
                                    <option value='06' >Tháng 6</option>
                                    <option value='07' >Tháng 7</option>
                                    <option value='08' >Tháng 8</option>
                                    <option value='09' >Tháng 9</option>
                                    <option value='10' >Tháng 10</option>
                                    <option value='11' >Tháng 11</option>
                                    <option value='12' >Tháng 12</option>
                                </select>
                                <label htmlFor='sel-year'>Năm:</label>
                                <input type='number' name='sel-year' id='sel-year' className={styles['input-field']} value={newYear} onChange={(e) => setNewYear(e.target.value)} />
                                <label htmlFor='budg-limit'>Hạn mức:</label>
                                <input type='number' name='budg-limit' id='budg-limit' className={styles['input-field']} style={{ width: '90px', marginRight: '110px' }} value={newLimitAmount} onChange={(e) => setNewLimitAmount(e.target.value)} />
                                <label htmlFor='alert-threshold' style={{ marginLeft: '110px' }} >    Ngưỡng cảnh báo (%):</label>
                                <input type='number' name='alert-threshold' id='alert-threshold' className={styles['input-field']} style={{ width: '42px' }} value={newAlertThreshold} onChange={(e) => setNewAlertThreshold(e.target.value)} />
                                <label htmlFor='sel-state' style={{ marginTop: '10px' }} >Trạng thái:</label>
                                <select name='sel-state' id='sel-state' className={styles['filt-selector']} style={{ width: '130px', marginTop: '10px' }} value={newIsActive} onChange={(e) => setNewIsActive(e.target.value)} >
                                    <option value='active' >Hoạt động</option>
                                    <option value='non-active' >Không hoạt động</option>
                                </select>
                                <button className={styles['budg-button']} style={{ marginLeft: '350px', marginTop: '10px' }} onClick={handleConfirmAdd} >Thêm ngân sách</button>
                            </div>}
                            {activeFunc === 2 && <div>
                                <label htmlFor='sel-category'>Danh mục:</label>
                                <select name='sel-category' id='sel-category' className={styles['filt-selector']} style={{ width: '120px' }} value={edittedCategory} onChange={(e) => setEdittedCategory(e.target.value)} >
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
                                <label htmlFor='sel-month'>Tháng:</label>
                                <select name='sel-month' id='sel-month' className={styles['filt-selector']} style={{ width: '85px' }} value={edittedMonth} onChange={(e) => setEdittedMonth(e.target.value)} >
                                    <option value='01' >Tháng 1</option>
                                    <option value='02' >Tháng 2</option>
                                    <option value='03' >Tháng 3</option>
                                    <option value='04' >Tháng 4</option>
                                    <option value='05' >Tháng 5</option>
                                    <option value='06' >Tháng 6</option>
                                    <option value='07' >Tháng 7</option>
                                    <option value='08' >Tháng 8</option>
                                    <option value='09' >Tháng 9</option>
                                    <option value='10' >Tháng 10</option>
                                    <option value='11' >Tháng 11</option>
                                    <option value='12' >Tháng 12</option>
                                </select>
                                <label htmlFor='sel-year'>Năm:</label>
                                <input type='number' name='sel-year' id='sel-year' className={styles['input-field']} value={edittedYear} onChange={(e) => setEdittedYear(e.target.value)} />
                                <label htmlFor='budg-limit'>Hạn mức:</label>
                                <input type='number' name='budg-limit' id='budg-limit' className={styles['input-field']} style={{ width: '90px', marginRight: '110px' }} value={edittedLimitAmount} onChange={(e) => setEdittedLimitAmount(e.target.value)} />
                                <label htmlFor='alert-threshold' style={{ marginLeft: '110px' }} >    Ngưỡng cảnh báo (%):</label>
                                <input type='number' name='alert-threshold' id='alert-threshold' className={styles['input-field']} style={{ width: '42px' }} value={edittedAlertThreshold} onChange={(e) => setEdittedAlertThreshold(e.target.value)} />
                                <label htmlFor='sel-state' style={{ marginTop: '10px' }} >Trạng thái:</label>
                                <select name='sel-state' id='sel-state' className={styles['filt-selector']} style={{ width: '130px', marginTop: '10px' }} value={edittedIsActive} onChange={(e) => setEdittedIsActive(e.target.value)} >
                                    <option value='active' >Hoạt động</option>
                                    <option value='non-active' >Không hoạt động</option>
                                </select>
                                <button className={styles['budg-button']} style={{ marginLeft: '370px', marginTop: '10px' }} onClick={handleConfirmEdit} >Lưu thay đổi</button>
                            </div>}
                        </div>
                    </section>
                </div>
                <div className={styles['stat-region']} >
                    <section style={{ paddingLeft: '15px', paddingTop: '15px' }} >
                        <p style={{ color: 'rgb(69, 74, 73)', display: 'inline', marginRight: '20px' }} ><strong>Thông số</strong></p>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                </div>
            </section>
        </div>
    )
}
