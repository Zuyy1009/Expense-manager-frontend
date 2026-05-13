import styles from './register.module.css'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

export function Register({ onLogin }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        // Đảm bảo bạn đã có các state tương ứng từ Form
        const userData = { username, email, password };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.success) {
                // 1. Lưu token giống hệt như lúc đăng nhập
                localStorage.setItem('userToken', data.token);

                // 2. Thông báo cho App.jsx biết đã có user (để hiện Sidebar)
                // Phải truyền prop onLogin từ App.jsx vào Register
                if (onLogin) onLogin();

                alert("Đăng ký thành công!");
                navigate('/stat'); // Chuyển hướng về trang thống kê
            } else {
                // Hiển thị lỗi từ Backend (ví dụ: "Email already in use")
                alert(data.message);
            }
        } catch (err) {
            console.error("Lỗi kết nối đăng ký:", err);
            alert("Không thể kết nối đến server.");
        }
    };

    return (
        <div className={styles['outer-boundary']} >
            <section className={styles['left-empty']}></section>
            <section className={styles['middle-sect']}>
                <section className={styles['top-sub-empty']}></section>
                <section className={styles['login-region']}>
                    <h3 style={{ fontSize: "20px", marginBottom: "-10px" }}>TẠO TÀI KHOẢN MỚI</h3>
                    <p>Tên người dùng</p>
                    <input type='text' className={styles['input-field']} value={username} onChange={(e) => setUsername(e.target.value)} />
                    <p>Email</p>
                    <input type='email' className={styles['input-field']} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p>Mật khẩu</p>
                    <input type='password' className={styles['input-field']} value={password} onChange={(e) => setPassword(e.target.value)} />
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
                    }} onClick={handleRegister} >
                        <strong>ĐĂNG KÝ</strong>
                    </button>
                </section>
                <section className={styles['down-sub-empty']}></section>
            </section>
            <section className={styles['right-empty']}></section>
        </div>
    )
}