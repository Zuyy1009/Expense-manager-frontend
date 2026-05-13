import styles from './budget.module.css';
import { useState, useEffect, useMemo } from 'react';

export function Budget() {
    const [budgetsList, setBudgetsList] = useState([]);
    const [categories, setCategories] = useState([]); // Lấy danh mục chi phí từ DB
    const [activeFunc, setActiveFunc] = useState(0);
    const [filtMonth, setFiltMonth] = useState(new Date().getMonth() + 1);
    const [filtYear, setFiltYear] = useState(new Date().getFullYear());
    const [filtState, setFiltState] = useState('all-states');

    const token = localStorage.getItem('userToken');

    // 1. Lấy danh sách ngân sách dựa trên tháng/năm bộ lọc
    useEffect(() => {
        if (token) {
            fetch(`http://localhost:5000/api/budgets?month=${filtMonth}&year=${filtYear}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(resData => {
                    if (resData.success) setBudgetsList(resData.data);
                })
                .catch(err => console.error("Lỗi fetch budgets: ", err));
        }
    }, [filtMonth, filtYear, token]);

    // 2. Lấy danh sách Categories loại 'expense' để chọn khi tạo ngân sách
    useEffect(() => {
        if (token) {
            fetch(`http://localhost:5000/api/categories?type=expense`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(resData => {
                    if (resData.success) {
                        setCategories(resData.data);
                        if (resData.data.length > 0) setNewCategory(resData.data[0]._id);
                    }
                });
        }
    }, [token]);

    // Logic lọc tại Frontend cho trạng thái Hoạt động
    const filteredBudgetsList = useMemo(() => {
        return budgetsList.filter(item => {
            const stateForComparison = item.isActive ? 'active' : 'non-active';
            return filtState === 'all-states' || stateForComparison === filtState;
        });
    }, [budgetsList, filtState]);

    // State cho Form Thêm/Sửa
    const [newCategory, setNewCategory] = useState('');
    const [newLimitAmount, setNewLimitAmount] = useState('');
    const [newAlertThreshold, setNewAlertThreshold] = useState(80);
    const [newIsActive, setNewIsActive] = useState('active');

    const handleConfirmAdd = () => {
        if (!newCategory || !newLimitAmount) {
            alert("Vui lòng nhập đủ danh mục và hạn mức!");
            return;
        }

        const body = {
            categoryId: newCategory,
            month: Number(filtMonth), // Sử dụng luôn tháng/năm đang lọc để tạo
            year: Number(filtYear),
            limitAmount: Number(newLimitAmount),
            alertThreshold: Number(newAlertThreshold)
        };

        fetch('http://localhost:5000/api/budgets', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setBudgetsList([...budgetsList, resData.data]);
                    setActiveFunc(0);
                    alert("Đã thêm ngân sách!");
                } else {
                    alert(resData.message);
                }
            });
    };

    const [editingId, setEditingId] = useState(null);
    const handleEditButton = (id) => {
        if (activeFunc === 2 && editingId === id) {
            setActiveFunc(0);
            setEditingId(null);
        } else {
            const item = budgetsList.find(b => b._id === id);
            setEditingId(id);
            setNewLimitAmount(item.limitAmount);
            setNewAlertThreshold(item.alertThreshold);
            setNewIsActive(item.isActive ? 'active' : 'non-active');
            setActiveFunc(2);
        }
    };

    const handleConfirmEdit = () => {
        const body = {
            limitAmount: Number(newLimitAmount),
            alertThreshold: Number(newAlertThreshold),
            isActive: newIsActive === 'active'
        };

        fetch(`http://localhost:5000/api/budgets/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setBudgetsList(budgetsList.map(b => b._id === editingId ? resData.data : b));
                    setActiveFunc(0);
                    alert("Đã cập nhật!");
                }
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Xóa ngân sách này?")) {
            fetch(`http://localhost:5000/api/budgets/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(() => {
                    setBudgetsList(budgetsList.filter(b => b._id !== id));
                });
        }
    };

    return (
        <div className={styles.container}>
            <h4>Quản lý Ngân sách</h4>
            <hr />
            <section className={styles['outer-boundary']}>
                <div className={styles['budget-region']}>
                    {/* BỘ LỌC */}
                    <section className={styles['filter-section']}>
                        <strong>Bộ lọc: </strong>
                        <select className={styles['filt-selector']} value={filtMonth} onChange={(e) => setFiltMonth(e.target.value)}>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                            ))}
                        </select>
                        <input className={styles['input-field']} type="number" value={filtYear} onChange={(e) => setFiltYear(e.target.value)} />
                        <select className={styles['filt-selector']} value={filtState} onChange={(e) => setFiltState(e.target.value)}>
                            <option value="all-states">Tất cả trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="non-active">Không hoạt động</option>
                        </select>
                    </section>

                    {/* DANH SÁCH */}
                    <div style={{ borderTop: '2px solid rgb(197, 197, 197)' }} ></div>
                    <div className={styles['bsl-boundary']} >
                        <ul className={styles['budgs-list']} style={{ listStyle: 'none', padding: 0 }}>
                            {filteredBudgetsList.map((item, index) => (
                                <li key={item._id} className={styles['budget-item']} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '60px 150px 100px 130px 160px 80px 100px',
                                    border: '2px solid rgb(0, 117, 70)', padding: '10px', marginBottom: '10px', borderRadius: '10px',
                                    backgroundColor: 'white'
                                }}>
                                    <span>{index + 1}</span>
                                    <strong>{item.categoryId?.name}</strong>
                                    <span>Tháng {item.month}</span>
                                    <span>{new Intl.NumberFormat('vi-VN').format(item.limitAmount)}đ</span>
                                    <span style={{ color: item.isExceeded ? 'red' : 'green' }}>
                                        Tiêu: {!item.isActive ? '- ' : (new Intl.NumberFormat('vi-VN').format(item.spent))}đ
                                    </span>
                                    <span>{!item.isActive ? '- ' : item.percentage}%</span>
                                    <div>
                                        <button className={styles['budg-button']} style={{ marginRight: '5px' }} onClick={() => handleEditButton(item._id)}>Sửa</button>
                                        <button className={styles['budg-button']} onClick={() => handleDelete(item._id)}>Xóa</button>
                                    </div>
                                    {/* Progress Bar */}
                                    <div style={{ gridColumn: '1 / -1', height: '12px', background: '#d7d7d7', borderRadius: '5px', marginTop: '10px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${Math.min(item.percentage, 100)}%`,
                                            height: '100%',
                                            backgroundColor: !item.isActive ? '#d7d7d7' : (item.isExceeded ? '#ff4d4f' : (item.isAlert ? '#faad14' : '#52c41a'))
                                        }}></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ borderTop: '2px solid rgb(197, 197, 197)' }} ></div>

                    {/* FORM THÊM / SỬA */}
                    <div className={styles['form-region']}>
                        <button className={styles['budg-button']} onClick={() => setActiveFunc(activeFunc === 1 ? 0 : 1)}>Thêm ngân sách</button>

                        {(activeFunc === 1 || activeFunc === 2) && (
                            <div className={styles['action-form']}>
                                <h4>{activeFunc === 1 ? "Thêm mới" : "Chỉnh sửa"}</h4>
                                {activeFunc === 1 && (
                                    <select className={styles['filt-selector']} value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                )}
                                Hạn mức:
                                <input className={styles['input-field-fw']} type="number" placeholder="Hạn mức" value={newLimitAmount} onChange={(e) => setNewLimitAmount(e.target.value)} />
                                Ngưỡng cảnh báo: 
                                <input className={styles['input-field-fw2']} type="number" placeholder="Ngưỡng cảnh báo %" value={newAlertThreshold} onChange={(e) => setNewAlertThreshold(e.target.value)} />
                                <select className={styles['filt-selector']} value={newIsActive} onChange={(e) => setNewIsActive(e.target.value)}>
                                    <option value="active">Hoạt động</option>
                                    <option value="non-active">Tắt</option>
                                </select>
                                <button className={styles['budg-button']} onClick={activeFunc === 1 ? handleConfirmAdd : handleConfirmEdit}>Xác nhận</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}