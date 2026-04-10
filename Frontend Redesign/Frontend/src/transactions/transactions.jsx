import styles from './transactions.module.css'

export function Transactions() {
    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['filter']} >Bộ lọc</div>
            <div className={styles['trans-list']} >Giao dịch</div>
            <div className={styles['func-list']} >Chức năng</div>
        </div>
    )
}
