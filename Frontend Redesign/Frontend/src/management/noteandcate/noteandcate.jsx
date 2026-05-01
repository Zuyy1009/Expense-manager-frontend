import styles from './noteandcate.module.css'
import { useState, useEffect } from 'react'

export function NoteAndCate() {
    const [catesList, setCatesList] = useState([]);
    const [notesList, setNotesList] = useState([]);
    const [activeFunc, setActiveFunc] = useState(0);
    const currentUserId = localStorage.getItem('currentUserId');

    useEffect(() => {
        fetch("http://localhost:8080/api/categorieslist")
            .then(res => res.json())
            .then(data => {
                setCatesList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    useEffect(() => {
        if (currentUserId) {
            fetch(`http://localhost:8080/api/nslist?userId=${currentUserId}`)
                .then(res => res.json())
                .then(data => {
                    setNotesList(data);
                })
                .catch(err => console.error("Đã xảy ra lỗi!: ", err));
        }
    }, [currentUserId]);

    const handleAddButton = () => {
        if (activeFunc === 1) {
            setActiveFunc(0);
        } else {
            setActiveFunc(1);
        }
    };

    const [filtType, setFiltType] = useState('all-ctype');
    const [sorterFunc, setSorterFunc] = useState('none');

    const rearrangedCatesList = [...catesList]; // Phải dùng toán tử trải rộng, nếu không catesList gốc sẽ bị thay đổi

    switch (sorterFunc) {
        case 'atoz':
            rearrangedCatesList.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            break;
        case 'ztoa':
            rearrangedCatesList.sort((a, b) => {
                return b.name.localeCompare(a.name);
            });
            break;
        default:
            break;
    }

    const filteredCatesList = rearrangedCatesList.filter(item => {
        const typeToCompare = item.type === 'Thu nhập' ? 'income' : 'expense';
        const matchType = (filtType === 'all-ctype' || typeToCompare === filtType);

        return matchType;
    });

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const handleConfirmAdd = () => {
        if (!newTitle || !newContent) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (!currentUserId) {
            alert("Không tìm thấy thông tin người dùng!");
            return;
        }

        const newNote = {
            userId: currentUserId,
            title: newTitle,
            content: newContent
        }

        fetch('http://localhost:8080/api/add-note', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote)
        })
            .then(res => {
                if (!res.ok) throw new Error("Cập nhật thất bại!");
                return res.json();
            })
            .then(updatedData => {
                setNotesList(updatedData);
                setActiveFunc(0);
                setNewTitle('');
                setNewContent('');
                alert('Đã thêm ghi chú!');
            })
            .catch(err => console.error("Lỗi khi thêm: ", err));
    };

    const [edittingId, setEdittingId] = useState(null);
    const [edittedTitle, setEdittedTitle] = useState('');
    const [edittedContent, setEdittedContent] = useState('');

    const handleEditButton = (id) => {
        if (activeFunc === 2) {
            setActiveFunc(0);
            setEdittingId(null);
        } else {
            setActiveFunc(2);
            setEdittingId(id);
            const itemToEdit = notesList.find(item => item._id === id);
            if (itemToEdit) {
                setEdittedTitle(itemToEdit.title);
                setEdittedContent(itemToEdit.content);
            }
        }
    };

    const handleConfirmEdit = () => {
        if (!edittingId) {
            alert("Vui lòng chọn ghi chú để sửa!")
            return;
        }

        const updatedNote = {
            userId: currentUserId,
            title: edittedTitle,
            content: edittedContent
        }

        fetch(`http://localhost:8080/api/update-note/${edittingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedNote),
        })
            .then(res => res.json())
            .then(updatedData => {
                setNotesList(updatedData);
                setActiveFunc(0);
                setEdittedTitle('');
                setEdittedContent('');
                alert("Đã chỉnh sửa ghi chú!");
            })
            .catch(err => console.error("Lỗi khi thêm: ", err));
    };

    /* Những hàm kích hoạt onClick có tham số phải đặt trong khối lệnh của 1 hàm mũi tên ẩn danh */
    return (
        <div>
            <h4 style={{ marginTop: '-1px' }} >Danh mục & Ghi chú</h4>
            <hr style={{ marginTop: '-10px' }} />
            <section className={styles['outer-boundary']} >
                <div className={styles['category-region']} >
                    <section style={{ paddingLeft: '15px', paddingTop: '15px' }} >
                        <p style={{ color: 'rgb(69, 74, 73)', display: 'inline', marginRight: '20px' }} ><strong>Danh mục</strong></p>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                    <section style={{ paddingLeft: '15px', paddingTop: '2px' }} >
                        <label htmlFor='ctype'>Loại</label>
                        <select name='ctype' id='ctype' className={styles['filt-selector']} style={{ width: '80px' }} value={filtType} onChange={(e) => setFiltType(e.target.value)} >
                            <option value='all-ctype' >Tất cả</option>
                            <option value='expense' >Chi tiêu</option>
                            <option value='income' >Thu nhập</option>
                        </select>
                        <label htmlFor='csorter'>Sắp xếp</label>
                        <select name='csorter' id='csorter' className={styles['filt-selector']} style={{ width: '120px' }} value={sorterFunc} onChange={(e) => setSorterFunc(e.target.value)} >
                            <option value='none' >Không sắp xếp</option>
                            <option value='atoz' >Từ A → Z</option>
                            <option value='ztoa' >Từ Z → A</option>
                        </select>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                    <section className={styles['cates-boundary']} >
                        <ul className={styles['cates-list']} style={{ listStyle: 'none' }} >
                            {filteredCatesList.map((item, index) => (
                                <li style={{
                                    border: '2px solid rgb(0, 117, 70)',
                                    borderRadius: '20px',
                                    backgroundColor: 'white',
                                    marginLeft: '-25px',
                                    marginBottom: '5px',
                                }} >
                                    <p style={{ marginLeft: '10px' }} ><strong>Danh mục: {index + 1}</strong></p>
                                    <hr style={{ marginTop: '-10px' }} />
                                    <p style={{ marginLeft: '10px' }} >Biểu tượng: <img style={{ width: '30px', marginBottom: '-6px' }} src={`${item.icon}`} /></p>
                                    <p style={{ marginLeft: '10px' }} >Tên danh mục: {item.name}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
                <div className={styles['note-region']} >
                    <section style={{ paddingLeft: '15px', paddingTop: '15px' }} >
                        <p style={{ color: 'rgb(69, 74, 73)', display: 'inline', marginRight: '20px' }} ><strong>Ghi chú</strong></p>
                    </section>
                    <hr style={{ marginTop: '6px' }} />
                    <section className={styles['notes-boundary']} >
                        <ul className={styles['notes-list']} style={{ listStyle: 'none' }} >
                            {notesList.map((item) => (
                                <li key={item._id} style={{
                                    border: '2px solid rgb(0, 117, 70)',
                                    borderRadius: '20px',
                                    backgroundColor: 'white',
                                    marginLeft: '-25px',
                                    marginBottom: '5px',
                                    paddingTop: '5px'
                                }} >
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '470px 55px 50px',
                                        height: '25px'
                                    }} >
                                        <p style={{
                                            marginLeft: '10px',
                                            display: 'inline',
                                            marginTop: '5px'
                                        }} ><strong>{item.title}</strong></p>
                                        <button className={styles['note-button']} style={{ marginRight: '5px', height: '25px' }} onClick={() => handleEditButton(item._id)} >Sửa</button>
                                        <button className={styles['note-button']} style={{ height: '25px' }} >Xóa</button>
                                    </div>
                                    <hr style={{ marginTop: '4px' }} />
                                    <p style={{ marginLeft: '10px', height: 'auto' }} >{item.content}</p>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section style={{
                        marginTop: '15px',
                        marginLeft: '15px',
                        display: 'grid',
                        gridTemplateColumns: '110px 5px 200px'
                    }} >
                        <div>
                            <button className={styles['note-button']} style={{ width: '100px', height: '25px', marginBottom: '10px' }} onClick={handleAddButton} >Thêm mới</button>
                            <button className={styles['note-button']} style={{ width: '100px', height: '25px' }} >Xóa tất cả</button>
                        </div>
                        <div style={{
                            borderLeft: '1px solid rgb(167, 167, 167)',
                            height: '222px',
                            marginTop: '-16px'
                        }} ></div>
                        <div>
                            {activeFunc === 1 && <div>
                                <input
                                    type='text'
                                    name='n-title'
                                    id='n-title'
                                    className={styles['input-field']}
                                    placeholder='Tiêu đề'
                                    style={{ width: '470px', height: '20px', marginBottom: '10px' }}
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                                <textarea
                                    type='textar'
                                    name='n-content'
                                    id='n-content'
                                    className={styles['text-field']}
                                    placeholder='Nội dung'
                                    style={{ width: '470px', height: '120px' }}
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                />
                                <button className={styles['note-button']} style={{ marginLeft: '10px', marginTop: '4px' }} onClick={handleConfirmAdd} >Thêm ghi chú</button>
                            </div>}
                            {activeFunc === 2 && <div>
                                <input
                                    type='text'
                                    name='n-title'
                                    id='n-title'
                                    className={styles['input-field']}
                                    placeholder='Tiêu đề'
                                    style={{ width: '470px', height: '20px', marginBottom: '10px' }}
                                    value={edittedTitle}
                                    onChange={(e) => setEdittedTitle(e.target.value)}
                                />
                                <textarea
                                    name='n-title'
                                    id='n-title'
                                    className={styles['text-field']}
                                    placeholder='Nội dung'
                                    style={{ width: '470px', height: '120px' }}
                                    value={edittedContent}
                                    onChange={(e) => setEdittedContent(e.target.value)}
                                />
                                <button className={styles['note-button']} style={{ marginLeft: '10px', marginTop: '4px' }} onClick={handleConfirmEdit} >Lưu thay đổi</button>
                            </div>}
                        </div>
                    </section>
                </div>
            </section>
        </div>
    )
}
