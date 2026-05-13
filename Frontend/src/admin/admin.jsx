import styles from './admin.module.css';
import { useState, useEffect } from 'react';

export function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem('userToken');

    // 1. Hàm lấy danh sách User từ Backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Khớp với Route: GET /api/admin/users?page=...&search=...
            const response = await fetch(`http://localhost:5000/api/admin/users?page=${page}&limit=20&search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API khi đổi trang hoặc nhấn tìm kiếm
    useEffect(() => {
        fetchUsers();
    }, [page]);

    // 2. Hàm Xóa User
    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${username}"? Toàn bộ giao dịch và ngân sách của họ cũng sẽ bị xóa vĩnh viễn.`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    alert("Xóa người dùng thành công!");
                    // Cập nhật lại danh sách tại chỗ
                    setUsers(users.filter(user => user._id !== userId));
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Lỗi khi xóa user:", error);
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset về trang 1 khi tìm kiếm mới
        fetchUsers();
    };

    return (
        <div className={styles['admin-container']}>
            <div className={styles['header-section']}>
                <h4>Quản lý người dùng</h4>
                <form className={styles['search-box']} onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles['input-field']}
                    />
                    <button type="submit" className={styles['acc-button']}>Tìm kiếm</button>
                </form>
            </div>

            <div className={styles['table-responsive']}>
                <div className={styles['user-table']}>
                    <section style={{
                        display: 'grid',
                        gridTemplateColumns: '50px 150px 300px 180px 180px 120px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                    }} >
                        <span><strong>STT</strong></span>
                        <span><strong>Username</strong></span>
                        <span><strong>Email</strong></span>
                        <span><strong>Ngày tham gia</strong></span>
                        <span><strong>Đăng nhập cuối</strong></span>
                        <span><strong>Hành động</strong></span>
                    </section>
                    <div className={styles['account-table']} >
                        {loading ? (
                            <tr><td colSpan="6">Đang tải dữ liệu...</td></tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <div key={user._id} style={{
                                    display: 'grid',
                                    paddingLeft: '7px',
                                    gridTemplateColumns: '43px 150px 300px 180px 202px 113px',
                                    marginBottom: '5px',
                                    border: '1.5px solid rgb(201, 201, 201)',
                                    borderRadius: '15px',
                                    height: '30px',
                                    paddingTop: '15px'
                                }}>
                                    <span>{(page - 1) * 20 + index + 1}</span>
                                    <span><strong>{user.username}</strong></span>
                                    <span>{user.email}</span>
                                    <span>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa đăng nhập'}</span>
                                    <span>
                                        <button
                                            className={styles['acc-button']}
                                            onClick={() => handleDeleteUser(user._id, user.username)}
                                            disabled={user.role === 'admin'} // Không cho tự xóa chính mình hoặc admin khác
                                        >
                                            Xóa
                                        </button>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <tr><td colSpan="6">Không tìm thấy người dùng nào.</td></tr>
                        )}
                    </div>
                </div>
            </div>

            {/* Phân trang */}
            <div className={styles['pagination']}>
                <button
                    className={styles['acc-button']}
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                >
                    Trước
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button
                    className={styles['acc-button']}
                    disabled={page >= totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}