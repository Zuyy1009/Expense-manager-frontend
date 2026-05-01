import { useState } from 'react'
import styles from './stat.module.css'
import { useEffect } from 'react'
import { Eating, Elecbill, Health, Housing, Movement, Otherexpense, Otherincome, Recreation, Salary, Shopping } from '../assets/category_icon/category-image';


export function Stat() {
    const [inc, setInc] = useState(0);
    const [exp, setExp] = useState(0);
    const [transList, setTransList] = useState([]);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        fetch("http://localhost:8080/api/data")
            .then(res => res.json())
            .then(data => {
                setInc(data.income);
                setExp(data.expense);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    useEffect(() => {
        if (currentUserId) {
            fetch(`http://localhost:8080/api/translist?userId=${currentUserId}`)
                .then(res => res.json())
                .then(data => {
                    setTransList(data);
                })
                .catch(err => console.error("Đã xảy ra lỗi!: ", err));
        }
    }, [currentUserId]);

    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['general-stat']} >
                <strong>Khái quát chung</strong>
                <hr />
                <section>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <span>Tổng thu nhập: </span>
                        <span>{inc}</span>
                    </div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <span>Tổng chi phí: </span>
                        <span>{exp}</span>
                    </div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                        <span>Chênh lệch: </span>
                        {((inc - exp) > 0) ?
                            <span style={{ color: "green" }} >{`${inc - exp}`}</span> :
                            <span style={{ color: "red" }} >{`${inc - exp}`}</span>
                        }
                    </div>
                    <hr />
                </section>
            </div>
            <div className={styles['recent-transactions']} >
                <strong>Giao dịch gần đây</strong>
                <hr />
                <ul className={styles['trans-list']} style={{ listStyle: 'none' }} >
                    {transList.slice(0, 5).map((item, index) => (
                        <li key={item._id} style={{
                            display: 'grid',
                            gridTemplateColumns: '20px 250px 70px 120px 150px 120px',
                            marginLeft: '-20px',
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
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles['chart']} >
                <strong>Biểu đồ</strong>
                <hr />
            </div>
        </div>
    )
}
