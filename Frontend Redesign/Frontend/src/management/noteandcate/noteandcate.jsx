import styles from './noteandcate.module.css'
import { useState, useEffect } from 'react'

export function NoteAndCate() {
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
