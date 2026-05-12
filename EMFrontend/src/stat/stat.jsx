import { useState, useEffect } from 'react';
import styles from './stat.module.css';

export function Stat() {
    const [summary, setSummary] = useState({ income: 0, expense: 0 });
    const [transList, setTransList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Các state cho bộ lọc
    const [pieMonth, setPieMonth] = useState(new Date().getMonth() + 1);
    const [barViewType, setBarViewType] = useState('7days'); // '7days', 'month', 'year'

    const token = localStorage.getItem('userToken');

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        fetch(`http://localhost:5000/api/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    setTransList(resData.data);
                    calculateSummary(resData.data);
                }
            })
            .catch(err => console.error("Lỗi fetch stat: ", err))
            .finally(() => setLoading(false));
    }, [token]);

    const calculateSummary = (list) => {
        const now = new Date();
        const currentMonth = now.getMonth(); // 0 - 11
        const currentYear = now.getFullYear();

        let inc = 0;
        let exp = 0;

        list.forEach(item => {
            const itemDate = new Date(item.date);

            // Chỉ tính nếu giao dịch thuộc tháng và năm hiện tại
            if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
                if (item.type === 'income') {
                    inc += item.amount;
                } else if (item.type === 'expense') {
                    exp += item.amount;
                }
            }
        });

        setSummary({ income: inc, expense: exp });
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

    // --- LOGIC BIỂU ĐỒ TRÒN (Lọc theo tháng được chọn) ---
    const filteredPieData = transList.reduce((acc, item) => {
        const itemDate = new Date(item.date);
        const now = new Date(); // Lấy thời gian hiện tại
        const currentYear = now.getFullYear(); // Lấy năm hiện tại

        // Thêm điều kiện: Năm của giao dịch phải trùng với năm hiện tại
        if (
            item.type === 'expense' &&
            (itemDate.getMonth() + 1) === Number(pieMonth) &&
            itemDate.getFullYear() === currentYear
        ) {
            const catName = item.categoryId?.name || 'Khác';
            acc[catName] = (acc[catName] || 0) + item.amount;
        }
        return acc;
    }, {});

    const totalPieExp = Object.values(filteredPieData).reduce((a, b) => a + b, 0);
    let currentPercent = 0;
    const pieEntries = Object.entries(filteredPieData);

    const gradientString = pieEntries.length > 0
        ? pieEntries.map(([name, value], index) => {
            const start = currentPercent;
            const end = start + (value / totalPieExp) * 100;
            currentPercent = end;
            return `hsl(${index * 40}, 70%, 55%) ${start}% ${end}%`;
        }).join(', ')
        : '#ddd 0% 100%';

    // --- LOGIC BIỂU ĐỒ CỘT (Xử lý theo viewType) ---
    const getBarData = () => {
        if (barViewType === '7days') {
            return [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const amount = transList
                    .filter(t => new Date(t.date).toDateString() === d.toDateString() && t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                return { label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), value: amount };
            }).reverse();
        }

        if (barViewType === 'month') {
            return [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const m = d.getMonth();
                const y = d.getFullYear();
                const amount = transList
                    .filter(t => {
                        const td = new Date(t.date);
                        return td.getMonth() === m && td.getFullYear() === y && t.type === 'expense';
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                return { label: `${m + 1}/${y}`, value: amount };
            }).reverse();
        }

        if (barViewType === 'year') {
            // Tạo mảng gồm 7 năm (năm hiện tại và 6 năm trước đó)
            return [...Array(7)].map((_, i) => {
                const d = new Date();
                const y = d.getFullYear() - i; // Lùi dần số năm

                const amount = transList
                    .filter(t => {
                        const td = new Date(t.date);
                        return td.getFullYear() === y && t.type === 'expense';
                    })
                    .reduce((sum, t) => sum + t.amount, 0);

                return {
                    label: y.toString(),
                    value: amount
                };
            }).reverse(); // Đảo ngược để năm cũ bên trái, năm nay bên phải
        }
    };

    const barData = getBarData();
    const maxBarVal = Math.max(...barData.map(d => d.value), 1);

    return (
        <div className={styles['outer-boundary']}>
            {/* Khái quát chung - Giữ nguyên */}
            <div className={styles['general-stat']}>
                <strong>Khái quát chung</strong>
                <hr />
                <section>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <span>Tổng thu nhập: </span>
                        <span style={{ color: "green", fontWeight: "bold" }}>{formatCurrency(summary.income)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <span>Tổng chi phí: </span>
                        <span style={{ color: "red", fontWeight: "bold" }}>{formatCurrency(summary.expense)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <span>Chênh lệch: </span>
                        <span style={{ color: (summary.income - summary.expense >= 0) ? "green" : "red", fontWeight: "bold" }}>
                            {formatCurrency(summary.income - summary.expense)}
                        </span>
                    </div>
                </section>
            </div>

            {/* Giao dịch gần đây - Giữ nguyên */}
            <div className={styles['recent-transactions']}>
                <strong>Giao dịch gần đây</strong>
                <hr />
                <ul className={styles['trans-list']} style={{ listStyle: 'none', padding: 0 }}>
                    {transList.slice(0, 5).map((item, index) => (
                        <li key={item._id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 120px 150px 100px', alignItems: 'center', border: '2px solid rgb(0, 117, 70)', borderRadius: '20px', padding: '10px', marginBottom: '8px', backgroundColor: 'white', height: '35px' }}>
                            <span><strong>{index + 1}</strong></span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.note || "(Không có ghi chú)"}</span>
                            <span>{item.categoryId?.name}</span>
                            <span style={{ color: item.type === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>{item.type === 'income' ? `+ ` : `- `}{formatCurrency(item.amount)}</span>
                            <span style={{ fontSize: '0.9em', color: '#666' }}>{formatDate(item.date)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles['chart']}>
                <strong>Biểu đồ chi tiêu</strong>
                <hr />

                {/* Bộ lọc Header cho biểu đồ */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '509px 340px',
                    marginBottom: '20px'
                }}>
                    <div style={{ marginLeft: '72px' }}>
                        <label>Tháng xem biểu đồ tròn: </label>
                        <select value={pieMonth} onChange={(e) => setPieMonth(e.target.value)} className={styles['filt-selector']}>
                            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Chế độ xem biểu đồ cột: </label>
                        <select value={barViewType} onChange={(e) => setBarViewType(e.target.value)} className={styles['filt-selector']}>
                            <option value="7days">7 ngày gần đây</option>
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '290px 180px 0.85fr', gap: '20px', alignItems: 'center' }}>
                    {/* Biểu đồ tròn */}
                    <div className={styles['pie-chart']} style={{ background: `conic-gradient(${gradientString})`, width: '200px', height: '200px', borderRadius: '50%', border: '1px solid #ddd' }}></div>

                    {/* Chú dẫn biểu đồ tròn */}
                    <div style={{ fontSize: '13px', maxHeight: '200px', overflowY: 'auto' }}>
                        {pieEntries.length > 0 ? pieEntries.map(([name, value], index) => (
                            <div key={name} style={{
                                display: 'grid',
                                gridTemplateColumns: '20px 85px 20px',
                                marginBottom: '5px'
                            }}>
                                <div style={{ width: '12px', height: '12px', backgroundColor: `hsl(${index * 40}, 70%, 55%)`, marginRight: '8px' }}></div>
                                <span>{name}</span>
                                <strong>{Math.round((value / totalPieExp) * 100)}%</strong>
                            </div>
                        )) : <p>Không có dữ liệu chi tiêu tháng này</p>}
                    </div>

                    {/* Biểu đồ cột */}
                    <div className={styles['bar-container']} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '200px', borderLeft: '2px solid #007546', borderBottom: '2px solid #007546', padding: '10px' }}>
                        {barData.map((data, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40px' }}>
                                <div className={styles['bar']} style={{
                                    height: `${(data.value / maxBarVal) * 150}px`,
                                    width: '25px',
                                    backgroundColor: '#007546',
                                    transition: 'height 0.3s ease'
                                }} title={formatCurrency(data.value)}></div>
                                <span style={{ fontSize: '10px', marginTop: '5px', whiteSpace: 'nowrap' }}>{data.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}