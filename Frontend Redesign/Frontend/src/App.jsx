import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import defAvt from './assets/dashboard_icon/def_avatar.png'
import './App.css'
import { Stat } from './stat/stat.jsx'
import { Transactions } from './transactions/transactions.jsx'
import { Management } from './management/management.jsx'
import { Login } from './login/login.jsx'
import { Register } from './login/register.jsx'

// Tạo một component riêng cho nội dung Dashboard để có thể sử dụng useNavigate
function DashboardLayout({ onLogOut }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Xóa dữ liệu đăng nhập
        //localStorage.clear();

        // 2. Chuyển hướng về trang login
        // Cách A: Dùng navigate (mượt, không load lại trang)
        onLogOut();
        navigate('/login');
        // Đã có path là '/login' ở phần Route

        // Cách B: Dùng window.location.href (load lại trang hoàn toàn, sạch bộ nhớ RAM)
        // window.location.href = '/login';
    };

    return (
        <div className='outer-boundary'>
            <aside className='left-sidebar'>
                <section className='account-sect'>
                    <img src={defAvt} alt='avatar' className="def-avt" />
                    <p style={{ color: "white" }}>Username1290</p>
                    <p style={{ color: "white", marginTop: "-5px" }}>example@gmail.com</p>
                </section>
                <section className='menu-sect'>
                    <Link to='/stat' className='link-button'>Thống kê</Link>
                    <Link to='/transactions' className='link-button'>Giao dịch</Link>
                    <Link to='/management' className='link-button'>Quản lý</Link>

                    {/* Gắn sự kiện onClick vào đây */}
                    <button onClick={handleLogout} className='logout-button'>
                        Đăng xuất
                    </button>
                    {/* Không được thả ngoặc () sau handleLogout*/}
                </section>
            </aside>

            <main className='function-section'>
                <Routes>
                    <Route path='/stat' element={<Stat />} />
                    <Route path='/transactions' element={<Transactions />} />
                    <Route path='/management' element={<Management />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    // const isAuthenticated = !!localStorage.getItem('userToken');

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <Router>
            <Routes>
                {/* TRANG MẶC ĐỊNH (/) */}
                <Route path="/" element={
                    loggedIn ? <Navigate to="/stat" /> : <Navigate to="/login" />
                } />

                {/* CÁC TRANG CÔNG KHAI (Không có Sidebar) */}
                <Route path="/login" element={<Login  onLogin={() => setLoggedIn(true)} />} />
                <Route path="/register" element={<Register />} />

                {/* CÁC TRANG NỘI BỘ (Có Sidebar) */}
                <Route path="*" element={
                    loggedIn ? <DashboardLayout onLogOut={() => setLoggedIn(false)} /> : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

export default App
