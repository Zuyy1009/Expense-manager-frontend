import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import Logo from './assets/Logo.png'
import './App.css'
import { Stat } from './stat/stat.jsx'
import { Transactions } from './transactions/transactions.jsx'
import { Management } from './management/management.jsx'
import { Login } from './login/login.jsx'
import { Register } from './login/register.jsx'
import { Account } from './account/account.jsx'
import { Admin } from './admin/admin.jsx' // Import trang Admin mới

function DashboardLayout({ onLogOut, userRole }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        onLogOut();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className='outer-boundary'>
            <aside className='left-sidebar'>
                <section className='account-sect'>
                    <h2 style={{ color: "white" }}>{userRole === 'admin' ? 'ADMIN MENU' : 'MENU'}</h2>
                </section>
                <section className='menu-sect'>
                    {/* Hiển thị Menu dựa trên Role */}
                    {userRole === 'admin' ? (
                        <>
                            <Link to='/admin' className={`link-button${isActive('/admin') ? '-active' : ''}`}>Quản lý tài khoản</Link>
                        </>
                    ) : (
                        <>
                            <Link to='/stat' className={`link-button${isActive('/stat') ? '-active' : ''}`}>Thống kê</Link>
                            <Link to='/transactions' className={`link-button${isActive('/transactions') ? '-active' : ''}`}>Giao dịch</Link>
                            <Link to='/management' className={`link-button${isActive('/management') ? '-active' : ''}`}>Ngân sách</Link>
                        </>
                    )}
                    <Link to='/account' className={`link-button${isActive('/account') ? '-active' : ''}`}>Tài khoản</Link>

                    <button onClick={handleLogout} className='logout-button'>Đăng xuất</button>
                </section>
                <section className='logo-sect' style={{ marginTop: '120px' }} >
                    <img src={Logo} className="logo-img" alt="logoimg" />
                    <h2 style={{ color: 'white' }} >Expense Manager</h2>
                </section>
            </aside>

            <main className='function-section'>
                <Routes>
                    {/* Route Chỉ cho phép User thường truy cập */}
                    {userRole !== 'admin' && (
                        <>
                            <Route path='/stat' element={<Stat />} />
                            <Route path='/transactions' element={<Transactions />} />
                            <Route path='/management' element={<Management />} />
                        </>
                    )}

                    {/* Route cho Admin (Chỉ render nếu đúng role) */}
                    {userRole === 'admin' && <Route path='/admin' element={<Admin />} />}

                    <Route path='/account' element={<Account />} />

                    {/* Tự động điều hướng nếu vào path lạ */}
                    <Route path="*" element={<Navigate to={userRole === 'admin' ? "/admin" : "/stat"} />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('userToken'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

    // Đồng bộ trạng thái khi Login thành công
    const handleLoginSuccess = () => {
        setLoggedIn(true);
        setUserRole(localStorage.getItem('userRole'));
    };

    const handleLogoutSuccess = () => {
        setLoggedIn(false);
        setUserRole(null);
    };

    return (
        <Router>
            <Routes>
                {/* 1. Trang điều hướng gốc */}
                <Route path="/" element={
                    loggedIn ? (
                        userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/stat" />
                    ) : <Navigate to="/login" />
                } />

                {/* 2. Các trang công khai */}
                <Route path="/login" element={
                    !loggedIn ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/" />
                } />
                <Route path="/register" element={
                    !loggedIn ? <Register onLogin={handleLoginSuccess} /> : <Navigate to="/" />
                } />

                {/* 3. Các trang nội bộ (Sử dụng Layout) */}
                <Route path="*" element={
                    loggedIn ? (
                        <DashboardLayout
                            onLogOut={handleLogoutSuccess}
                            userRole={userRole}
                        />
                    ) : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

export default App;