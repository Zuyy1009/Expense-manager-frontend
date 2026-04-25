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
