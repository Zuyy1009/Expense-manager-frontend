import styles from './budget.module.css'
import { useState, useEffect } from 'react'

export function Budget() {
    const [budgetsList, setBudgetsList] = useState([]);
    const [iconsMap, setIconsMap] = useState({});

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

    const filteredBudgetsList = budgetsList;

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
                        <select name='year' id='year' className={styles['filt-selector']} style={{ width: '100px' }} >
                            <option value='all-years' >Tất cả năm</option>
                            <option value='2026' >2026</option>
                            <option value='2025' >2025</option>
                            <option value='2024' >2024</option>
                            <option value='2023' >2023</option>
                            <option value='2022' >2022</option>
                        </select>
                        <label htmlFor='state' >Trạng thái</label>
                        <select name='state' id='state' className={styles['filt-selector']} style={{ width: '130px' }} >
                            <option value='all-states'>Tất cả trạng thái</option>
                            <option value='active' >Hoạt động</option>
                            <option value='non-active' >Không hoạt động</option>
                        </select>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                    <section className={styles['budgs-list-region']} >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '45px 205px 75px 77px 100px 153px 180px 80px',
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
                                        gridTemplateColumns: '30px 50px 160px 75px 80px 150px 100px 180px 50px',
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
                                        {item.isActive === true ?
                                            <div style={{
                                                width: '300px',
                                                height: '15px',
                                                backgroundColor: 'rgb(217, 239, 233)',
                                                border: '2px solid rgb(46, 158, 115)',
                                                borderRadius: '20px',
                                                marginTop: '10px'
                                            }} ></div> :
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
                </div>
                <div className={styles['stat-region']} ></div>
            </section>
        </div>
    )
}
