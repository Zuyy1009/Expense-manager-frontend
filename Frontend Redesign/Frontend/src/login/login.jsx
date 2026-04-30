import { useState } from 'react'
import styles from './login.module.css'
import { useNavigate, Link } from 'react-router-dom'

export function Login({ onLogin }) {
    const navigate = useNavigate(); // Gọi Hook ở đây, đúng quy tắc

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.userId) {
                    localStorage.setItem('currentUserId', data.userId);
                    onLogin(data.userId); // Gọi để biết là đã có người đăng nhập
                    navigate('/');
                } else {
                    alert(data.message);
                }
            })
            .catch(err => console.error("Lỗi đăng nhập:", err));

        console.log("Dữ liệu gửi đi:", { email, password })
    };

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
                    <h3 style={{ fontSize: "20px", marginBottom: "-10px" }}>ĐĂNG NHẬP</h3>

                    <p>Email</p>
                    <input
                        type='email'
                        className={styles['input-field']}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <p>Mật khẩu</p>
                    <input
                        type='password'
                        className={styles['input-field']}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <br />
                    <button
                        onClick={handleLogin} // Thêm sự kiện click vào đây
                        style={{
                            marginTop: "15px", // Tăng khoảng cách một chút cho đẹp
                            backgroundColor: "rgb(0, 117, 70)",
                            color: "white",
                            width: "200px",
                            height: "35px",
                            borderRadius: "20px",
                            fontSize: "17px",
                            border: "none", // Xóa viền mặc định của button
                            cursor: "pointer" // Hiện bàn tay khi di chuột vào
                        }}
                    >
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
