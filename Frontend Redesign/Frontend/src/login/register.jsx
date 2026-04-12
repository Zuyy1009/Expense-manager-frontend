import styles from './register.module.css'

export function Register() {
    return (
        <div className={styles['outer-boundary']} >
            <section className={styles['left-empty']}></section>
            <section className={styles['middle-sect']}>
                <section className={styles['top-sub-empty']}></section>
                <section className={styles['login-region']}>
                    <h3 style={{fontSize: "20px", marginBottom:"-10px"}}>TẠO TÀI KHOẢN MỚI</h3>
                    <p>Tên người dùng</p>
                    <input type='text' className={styles['input-field']} />
                    <p>Email</p>
                    <input type='email' className={styles['input-field']} />
                    <p>Mật khẩu</p>
                    <input type='password' className={styles['input-field']} />
                    <br />
                    <button style={{
                        marginTop: "5px",
                        backgroundColor: "rgb(0, 117, 70)",
                        color: "white",
                        width: "200px",
                        height: "30px",
                        borderRadius: "20px",
                        fontSize: "17px",
                        marginBottom: "15px",
                        border: "none",
                        cursor: "pointer",
                    }}>
                        <strong>ĐĂNG KÝ</strong>
                    </button>
                </section>
                <section className={styles['down-sub-empty']}></section>
            </section>
            <section className={styles['right-empty']}></section>
        </div>
    )
}
