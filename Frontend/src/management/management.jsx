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
            <div className={styles['function-content']} >
                <Budget />
            </div>
        </div>
    )
}