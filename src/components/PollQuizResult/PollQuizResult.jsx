import React from 'react';
import styles from './PollQuiz.module.css';

const PollQuizResult=()=>{
    return (
        <div className={styles.result_container}>
            <div>
                <h1>Thank You</h1>
                <h1>for participating in</h1>
                <h1> the poll</h1>
            </div>
        </div>
    )
}

export default PollQuizResult;