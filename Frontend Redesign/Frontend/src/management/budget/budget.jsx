import styles from './budget.module.css'
import { useState, useEffect } from 'react'

export function Budget() {
    const [budgetsList, setBudgetsList] = useState([]);
    const [iconsMap, setIconsMap] = useState({});
    const [activeFunc, setActiveFunc] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8080/api/budgetslist")
            .then(res => res.json())
            .then(data => {
                setBudgetsList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

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

    const handleEditButton = () => {
        if (activeFunc === 2) {
            setActiveFunc(0);
        } else {
            setActiveFunc(2);
        }
    };

    const filteredBudgetsList = budgetsList;

    /* Thứ tự hoạt động: Người dùng click -> onChange kích hoạt -> hàm handle cập nhật state */
    /* React re-render lại component -> cập nhật lại checked (hàm sau có true hay không) */

    return (
        <div>
            <h4 style={{ marginTop: '-1px' }} >Ngân sách</h4>
            <hr style={{ marginTop: '-10px' }} />
            <section className={styles['outer-boundary']} >
                <div className={styles['budget-region']} >
                    <section className={styles['filter-section']} >
                        <p style={{ color: 'rgb(69, 74, 73)', display: 'inline', marginRight: '20px' }} ><strong>Bộ lọc</strong></p>
                        <label htmlFor='month' >Tháng</label>
                        <select name='month' id='month' className={styles['filt-selector']} style={{ width: '100px' }} >
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
                        <input type='number' name='year' id='year' className={styles['input-field']} />
                        <label htmlFor='bstate' >Trạng thái</label>
                        <select name='bstate' id='bstate' className={styles['filt-selector']} style={{ width: '130px' }} >
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
                                    <li style={{
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
                                        <button className={styles['budg-button']} style={{ width: '45px', marginTop: '9px', marginBottom: '-3px' }} onClick={handleEditButton} >Sửa</button>
                                        <button className={styles['budg-button']} style={{ width: '45px', marginTop: '9px', marginBottom: '-3px' }} >Xóa</button>
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
                            <button className={styles['budg-button']} style={{ width: '100px', height: '27px' }}   >Xóa tất cả</button>
                        </div>
                        <div style={{
                            borderLeft: '1px solid rgb(167, 167, 167)',
                            height: '92px',
                            marginTop: '-9px'
                        }} ></div>
                        <div >
                            {activeFunc === 1 && <div>
                                <label htmlFor='sel-category'>Danh mục:</label>
                                <select name='sel-category' id='sel-category' className={styles['filt-selector']} style={{ width: '120px' }} >
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
                                <select name='sel-month' id='sel-month' className={styles['filt-selector']} style={{ width: '85px' }} >
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
                                <input type='number' name='sel-year' id='sel-year' className={styles['input-field']} />
                                <label htmlFor='budg-limit'>Hạn mức:</label>
                                <input type='number' name='budg-limit' id='budg-limit' className={styles['input-field']} style={{ width: '90px', marginRight: '110px' }} />
                                <label htmlFor='alert-threshold' style={{ marginLeft: '110px' }} >    Ngưỡng cảnh báo (%):</label>
                                <input type='number' name='alert-threshold' id='alert-threshold' className={styles['input-field']} style={{ width: '42px' }} />
                                <label htmlFor='sel-state' style={{ marginTop: '10px' }} >Trạng thái:</label>
                                <select name='sel-state' id='sel-state' className={styles['filt-selector']} style={{ width: '130px', marginTop: '10px' }}  >
                                    <option value='active' >Hoạt động</option>
                                    <option value='non-active' >Không hoạt động</option>
                                </select>
                                <button className={styles['budg-button']} style={{ marginLeft: '350px', marginTop: '10px' }} >Thêm ngân sách</button>
                            </div>}
                            {activeFunc === 2 && <div>
                                <label htmlFor='sel-category'>Danh mục:</label>
                                <select name='sel-category' id='sel-category' className={styles['filt-selector']} style={{ width: '120px' }} >
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
                                <select name='sel-month' id='sel-month' className={styles['filt-selector']} style={{ width: '85px' }} >
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
                                <input type='number' name='sel-year' id='sel-year' className={styles['input-field']} />
                                <label htmlFor='budg-limit'>Hạn mức:</label>
                                <input type='number' name='budg-limit' id='budg-limit' className={styles['input-field']} style={{ width: '90px', marginRight: '110px' }} />
                                <label htmlFor='alert-threshold' style={{ marginLeft: '110px' }} >    Ngưỡng cảnh báo (%):</label>
                                <input type='number' name='alert-threshold' id='alert-threshold' className={styles['input-field']} style={{ width: '42px' }} />
                                <label htmlFor='sel-state' style={{ marginTop: '10px' }} >Trạng thái:</label>
                                <select name='sel-state' id='sel-state' className={styles['filt-selector']} style={{ width: '130px', marginTop: '10px' }}  >
                                    <option value='active' >Hoạt động</option>
                                    <option value='non-active' >Không hoạt động</option>
                                </select>
                                <button className={styles['budg-button']} style={{ marginLeft: '350px', marginTop: '10px' }} >Lưu thay đổi</button>
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
