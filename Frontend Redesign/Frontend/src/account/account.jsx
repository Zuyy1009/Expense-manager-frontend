import styles from './account.module.css';

export function Account() {
    return (
        <div className={styles['outer-boundary']} >
            <section className={styles['account-setting-title']} >
                <h4 style={{ marginLeft: '15px', marginTop: '15px' }} >Thông tin tài khoản</h4>
            </section>
            <section className={styles['account-setting-info']} >
                <p style={{ display: 'inline', marginRight: '20px' }} >Avatar:</p>
                <br />
                <br />
                <p style={{ display: 'inline', marginRight: '20px' }} >Tên người dùng: </p>
                <input type='text' className={styles['input-field']} style={{ width: '300px' }} />
                <br />
                <br />
                <p style={{ display: 'inline', marginRight: '94px' }} >Email: </p>
                <input type='email' className={styles['input-field']} style={{ width: '300px' }} />
                <p>Đổi mật khẩu:</p>
                <div style={{
                    border: '2px solid rgb(138, 190, 169)',
                    borderRadius: '20px',
                    width: '445px',
                    height: '160px',
                    paddingLeft: '5px',
                    paddingTop: '20px',
                    backgroundColor: 'rgb(240, 248, 245)'
                }} >
                    <div style={{ display: 'inline', marginRight: '59px' }} >
                        <p style={{ display: 'inline' }}  >Mật khẩu hiện tại:</p>
                    </div>
                    <input type='password' className={styles['input-field']} style={{ width: '220px' }} />
                    <br />
                    <br />
                    <div style={{ display: 'inline', marginRight: '83px' }} >
                        <p style={{ display: 'inline' }} >Mật khẩu mới:</p>
                    </div>
                    <input type='password' className={styles['input-field']} style={{ width: '220px' }} />
                    <br />
                    <br />
                    <div style={{ display: 'inline', marginRight: '20px' }} >
                        <p style={{ display: 'inline' }} >Nhập lại mật khẩu mới:</p>
                    </div>
                    <input type='password' className={styles['input-field']} style={{ width: '220px' }} />
                </div>
                <div>
                    <br />
                    <button style={{
                        border: '2px solid rgb(0, 117, 70)',
                        borderRadius: '20px',
                        padding: '5px',
                        color: 'white',
                        fontWeight: 'bold',
                        background: 'rgb(0, 117, 70)',
                        cursor: 'pointer',
                        fontSize: '18px'
                    }} >LƯU THAY ĐỔI</button>
                </div>
            </section>
        </div>
    )
}
