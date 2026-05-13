import styles from './account.module.css';
import { useState } from 'react';

export function Account() {
    // 1. Khai báo state cho các trường nhập liệu
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        // 2. Kiểm tra logic cơ bản tại Frontend
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ các trường mật khẩu.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu mới và nhập lại mật khẩu không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        const token = localStorage.getItem('userToken');
        if (!token) {
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
            return;
        }

        setLoading(true);

        try {
            // 3. Gọi API PATCH đã thiết lập ở Backend
            const response = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("Chúc mừng! Mật khẩu của bạn đã được cập nhật thành công.");
                // Reset form sau khi thành công
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                alert(data.message || "Có lỗi xảy ra khi đổi mật khẩu.");
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
            alert("Không thể kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['outer-boundary']}>
            <section className={styles['account-setting-title']}>
                <h4 style={{ marginLeft: '15px', marginTop: '15px' }}>Tài khoản</h4>
            </section>
            <section className={styles['account-setting-info']}>
                <p>Đổi mật khẩu:</p>
                <div style={{
                    border: '2px solid rgb(138, 190, 169)',
                    borderRadius: '20px',
                    width: '445px',
                    padding: '20px 15px',
                    backgroundColor: 'rgb(240, 248, 245)'
                }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'inline-block', width: '150px' }}>Mật khẩu hiện tại:</label>
                        <input 
                            type='password' 
                            className={styles['input-field']} 
                            style={{ width: '220px' }} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'inline-block', width: '150px' }}>Mật khẩu mới:</label>
                        <input 
                            type='password' 
                            className={styles['input-field']} 
                            style={{ width: '220px' }} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'inline-block', width: '150px' }}>Nhập lại mật khẩu:</label>
                        <input 
                            type='password' 
                            className={styles['input-field']} 
                            style={{ width: '220px' }} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <br />
                    <button 
                        onClick={handleChangePassword}
                        disabled={loading}
                        style={{
                            border: '2px solid rgb(0, 117, 70)',
                            borderRadius: '20px',
                            padding: '8px 20px',
                            color: 'white',
                            fontWeight: 'bold',
                            background: loading ? '#ccc' : 'rgb(0, 117, 70)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '18px'
                        }}
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : 'LƯU THAY ĐỔI'}
                    </button>
                </div>
            </section>
        </div>
    );
}