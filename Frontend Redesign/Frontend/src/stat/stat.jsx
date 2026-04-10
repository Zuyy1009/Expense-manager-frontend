import styles from './stat.module.css'

export function Stat() {
    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['general-stat']} >Tổng quát chung</div>
            <div className={styles['recent-transactions']} >Giao dịch gần đây</div>
            <div className={styles['chart']} >Biểu đồ</div>
        </div>
    )
}
