import styles from './budget.module.css'
import { useState, useEffect } from 'react'

export function Budget() {
    const [budgetList, setBudgetList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/budgetslist")
            .then(res => res.json())
            .then(data => {
                setBudgetList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    return (
        <div>
            <h4 style={{ marginTop: '-1px' }} >Ngân sách</h4>
            <hr style={{ marginTop: '-10px' }} />
            <section className={styles['outer-boundary']} >
                <div className={styles['budget-region']} >
                    <section className={styles['filter-section']} >
                        <p style={{color: 'rgb(69, 74, 73)', display: 'inline', marginRight: '20px'}} ><strong>Bộ lọc</strong></p>
                        <label htmlFor='month' >Tháng</label>
                        <select name='month' id='month' className={styles['filt-selector']} style={{width: '90px'}} >
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
                        <select name='year' id='year' className={styles['filt-selector']} style={{width: '70px'}} >
                            <option value='2026' >2026</option>
                            <option value='2025' >2025</option>
                            <option value='2024' >2024</option>
                            <option value='2023' >2023</option>
                            <option value='2022' >2022</option>
                        </select>
                        <label htmlFor='state' >Trạng thái</label>
                        <select name='state' id='state' className={styles['filt-selector']} style={{width: '130px'}} >
                            <option value='active' >Hoạt động</option>
                            <option value='non-active' >Không hoạt động</option>
                        </select>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                </div>
                <div className={styles['stat-region']} ></div>
            </section>
        </div>
    )
}
