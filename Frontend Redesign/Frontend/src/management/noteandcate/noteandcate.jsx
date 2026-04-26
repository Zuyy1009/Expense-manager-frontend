import styles from './noteandcate.module.css'
import { useState, useEffect } from 'react'

export function NoteAndCate() {
    const [catesList, setCatesList] = useState([]);
    const [notesList, setNotesList] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/categorieslist")
            .then(res => res.json())
            .then(data => {
                setCatesList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/nslist")
            .then(res => res.json())
            .then(data => {
                setNotesList(data);
            })
            .catch(err => console.error("Đã xảy ra lỗi!: ", err));
    }, []);

    const rearrangedCatesList = catesList;

    const filteredCatesList = rearrangedCatesList;

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
                        <select name='ctype' id='ctype' className={styles['filt-selector']} style={{ width: '80px' }}  >
                            <option value='all-ctype' >Tất cả</option>
                            <option value='expense' >Chi tiêu</option>
                            <option value='income' >Thu nhập</option>
                        </select>
                        <label htmlFor='csorter'>Sắp xếp</label>
                        <select name='csorter' id='csorter' className={styles['filt-selector']} style={{ width: '120px' }}  >
                            <option value='none' >Không sắp xếp</option>
                            <option value='expense' >Từ A → Z</option>
                            <option value='income' >Từ Z → A</option>
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
                </div>
            </section>
        </div>
    )
}
