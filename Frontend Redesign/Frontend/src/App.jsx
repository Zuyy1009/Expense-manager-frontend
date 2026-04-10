import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom'
import defAvt from './assets/dashboard_icon/def_avatar.png' // Cần import mới dùng được ảnh
import './App.css'
import { Stat } from './stat/stat.jsx' // Dùng ngoặc nhọn để import nếu không phải export default
import { Transactions } from './transactions/transactions.jsx'
import { Management } from './management/management.jsx'
import { Login } from './log out/logout.jsx'


// Luôn đặt tên component với chữ cái đầu viết hoa, viết thường sẽ gây hiểu lầm

function App() {
    return (
        <Router>
            <div className='outer-boundary'>
                <aside className='left-sidebar'>
                    <section className='account-sect' >
                        <img src={defAvt} alt='avatar' className="def-avt" />
                        <p style={{color:"white"}} >Username1290</p>
                        <p style={{color:"white", marginTop: "-5px"}} >example@gmail.com</p>
                    </section>
                    <section className='menu-sect' >
                        <Link to='/' className='link-button' >Thống kê</Link>
                        <Link to='/transactions' className='link-button'>Giao dịch</Link>
                        <Link to='/management' className='link-button'>Quản lý</Link>
                        <Link to='/login' className='link-button'>Đăng xuất</Link>
                    </section>
                    <section className='logo-sect' ></section>
                </aside>
                <main className='function-section'>
                    <Routes>
                        <Route path='/' element={<Stat />} />
                        <Route path='/transactions' element={<Transactions />} />
                        <Route path='/management' element={<Management />} />
                        <Route path='/login' element={<Login />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
    // Phải có thẻ Router bao quanh mới dùng được Link, Route,...
}

export default App
