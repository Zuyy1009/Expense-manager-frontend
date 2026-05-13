import { useState } from 'react'
import styles from './login.module.css'
import { useNavigate, Link } from 'react-router-dom'

export function Login({ onLogin }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // 1. Lưu Token để xác thực các API sau này
                localStorage.setItem('userToken', data.token);
                
                // 2. Lưu Role để App.jsx biết cách phân luồng Menu/Routes
                localStorage.setItem('userRole', data.user.role); 
                
                // Lưu thêm ID người dùng nếu cần thiết cho các logic khác
                localStorage.setItem('currentUserId', data.user._id);

                // 3. Thông báo cho App.jsx cập nhật trạng thái loggedIn
                onLogin();

                // 4. Điều hướng thông minh dựa trên quyền hạn
                if (data.user.role === 'admin') {
                    navigate('/admin'); // Admin vào trang quản lý user
                } else {
                    navigate('/stat');  // User thường vào trang thống kê cá nhân
                }
            } else {
                alert(data.message || "Email hoặc mật khẩu không chính xác");
            }
        } catch (error) {
            console.error("Lỗi kết nối đến Server:", error);
            alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        }
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
                        placeholder="example@gmail.com"
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
                        onClick={handleLogin}
                        style={{
                            marginTop: "15px",
                            backgroundColor: "rgb(0, 117, 70)",
                            color: "white",
                            width: "200px",
                            height: "35px",
                            borderRadius: "20px",
                            fontSize: "17px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        <strong>ĐĂNG NHẬP</strong>
                    </button>

                    <p style={{ marginTop: "15px" }}>
                        Chưa có tài khoản? <Link to='/register' style={{ color: 'rgb(0, 117, 70)', fontWeight: 'bold' }}>Đăng ký ngay</Link>
                    </p>
                </section>
                <section className={styles['down-sub-empty']}></section>
            </section>
            <section className={styles['right-empty']}></section>
        </div>
    )
}