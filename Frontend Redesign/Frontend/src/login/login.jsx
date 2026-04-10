import styles from './login.module.css'
import { useNavigate, Link } from 'react-router-dom'

export function Login() {
    const navigate = useNavigate(); // Gọi Hook ở đây, đúng quy tắc

    const handleGoToRegister = (e) => {
        e.preventDefault();
        navigate('/register'); // Điều hướng đến PATH, không phải file .jsx
    };

    return (
        <div className={styles['outer-boundary']} >
            <section className={styles['left-empty']}></section>
            <section className={styles['middle-sect']}>
                <section className={styles['top-sub-empty']}></section>
                <section className={styles['login-region']}>
                    <h3 style={{fontSize: "20px", marginBottom:"-10px"}}>ĐĂNG NHẬP</h3>
                    <p>Email</p>
                    <input type='text' className={styles['input-field']} />
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
                    }}>
                        <strong>ĐĂNG NHẬP</strong>
                    </button>
                    <p>Chưa có tài khoản? <Link to='/register'>Đăng ký</Link></p>
                </section>
                <section className={styles['down-sub-empty']}></section>
            </section>
            <section className={styles['right-empty']}></section>
        </div>
    )
}
