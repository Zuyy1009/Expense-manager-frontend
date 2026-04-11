import { useState } from 'react'
import styles from './stat.module.css'
import { useEffect } from 'react'


export function Stat() {
    const [inc, setInc] = useState(0);
    const [exp, setExp] = useState(0);

    useEffect(() => {
        fetch("http://localhost:8080/api/data")
            .then(res => res.json())
            .then(data => {
                setInc(data.income);
                setExp(data.expense);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);
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
            </div>
            <div className={styles['chart']} >
                <strong>Biểu đồ</strong>
                <hr />
            </div>
        </div>
    )
}
