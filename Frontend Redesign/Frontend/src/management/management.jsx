import styles from './management.module.css'
import { useState } from 'react'
import fimg1 from '../assets/function_icon/budget_icon.png'
import fimg1c from '../assets/function_icon/budget_chosen.png'
import fimg2 from '../assets/function_icon/note_icon.png'
import fimg2c from '../assets/function_icon/note_chosen.png'
import fimg3 from '../assets/function_icon/saving_goal_icon.png'
import fimg3c from '../assets/function_icon/saving_goal_chosen.png'
import { Budget } from './budget/budget'
import { NoteAndCate } from './noteandcate/noteandcate'

export function Management() {
    const [activeTab, setActiveTab] = useState(1);
    // Không nhất thiết phải là True False

    return (
        <div className={styles['outer-boundary']} >
            <div className={styles['function-col']} >
                <button className={styles['function-button']} onClick={() => setActiveTab(1)} >
                    <img src={activeTab === 1 ? fimg1c : fimg1} className={styles['button-img']} alt='function1icon' />
                </button>
                <button className={styles['function-button']} onClick={() => setActiveTab(2)} >
                    <img src={activeTab === 2 ? fimg2c : fimg2} className={styles['button-img']} alt='function1icon' />
                </button>
                <button className={styles['function-button']} onClick={() => setActiveTab(3)} >
                    <img src={activeTab === 3 ? fimg3c : fimg3} className={styles['button-img']} alt='function1icon' />
                </button>
            </div>
            <div className={styles['function-content']} >
                {/* Hiển thị nội dung tương ứng với tab đang chọn */}
                {activeTab === 1 && <Budget />}
                {activeTab === 2 && <NoteAndCate />}
                {activeTab === 3 && <p>Mục tiêu tiết kiệm</p>}
            </div>
        </div>
    )
}
