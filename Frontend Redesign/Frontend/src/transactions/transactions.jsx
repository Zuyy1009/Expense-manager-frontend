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
                    {filteredTransList.map(item => (
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
                            <p><strong>{item.id}</strong></p>
                            <p>{item.note}</p>
                            <p><img style={{ width: '30px', marginTop: '-5px' }} src={item.categoryIcon} /></p>
                            <p>{item.category}</p>
                            <p style={item.type === 'Thu nhập' ? { color: 'green' } : { color: 'red' }}>
                                {item.type === 'Thu nhập' ? `+ ` : `- `}{`${item.amount} đ`}
                            </p>
                            <p>{item.date}</p>
                            <input type={addEdit === 2 ? 'radio' : 'checkbox'} name='trans-item' value={item.id} className={styles['t-checkbox']} />
                        </li>
                    ))}
                </ul>
                {addEdit === 1 && <p>Trình thêm mới</p>}
                {addEdit === 2 && <p>Trình chỉnh sửa</p>}
            </div>
            <div className={styles['func-list']} >
                <section className={styles['func-region']} >
                    <strong style={{ marginRight: '20px' }} >Chức năng</strong>
                    <button className={styles['func-button']} onClick={handleAddButton} >Thêm mới</button>
                    <button className={styles['func-button']} onClick={handleEditButton} >Sửa giao dịch</button>
                    <button className={styles['func-button']} >Xóa</button>
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
                    }} placeholder='Nhập tên giao dịch'/>
                </section>
            </div>
        </div>
    )
}
