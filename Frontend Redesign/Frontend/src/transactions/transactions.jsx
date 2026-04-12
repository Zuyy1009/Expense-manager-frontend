import styles from './transactions.module.css'
import { useState, useEffect } from 'react';

export function Transactions() {
    const [transList, setTransList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/translist")
            .then(res => res.json())
            .then(data => {
                setTransList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['filter']} >
                <strong>Bộ lọc</strong>
            </div>
            <div className={styles['trans-region']} >
                <strong>Giao dịch</strong>
                <hr />
                <ul className={styles['trans-list']} style={{ listStyle: 'none' }} >
                    {transList.map(item => (
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
                            <input type='checkbox' className={styles['t-checkbox']} />
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles['func-list']} >
                <strong>Chức năng</strong>
            </div>
        </div>
    )
}
