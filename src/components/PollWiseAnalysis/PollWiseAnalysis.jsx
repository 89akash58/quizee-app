import React from "react";
import styles from "./PollWiseAnalysis.module.css"

const PollWiseAnalysis=({quiz})=>{
    const createdAtDate=new Date(quiz.createdAt);
    const formattedDate = `${String(createdAtDate.getDate()).padStart(2, '0')} ${createdAtDate.toLocaleString('default', { month: 'short' })}, ${String(createdAtDate.getFullYear())}`;
     
    console.log(quiz);

    return (
        <div className={styles.QAAnalysis_container}>
            <div className={styles.header}>
                <p>{quiz.quizName} Question Analysis</p>
                <div>
                    <p>Created on : {formattedDate}</p>
                    <p>Impressions : {quiz.totalImpressions}</p>
                </div>
            </div>

            {quiz.questionSets.map((question, questionIndex) => {
                return (
                    <div className={styles.display_question} key={questionIndex}>
                        <p>Q.{questionIndex + 1} {question.pollQuestion}</p>
                        <div>
                            {question.optionSets.map((option, optionIndex) => {
                                return (
                                    <div key={optionIndex}>
                                        <p>{option.optionPollCount}</p>
                                        <p>Option {optionIndex + 1}</p>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                )
            })}

        </div>
    )
        
}

export default PollWiseAnalysis;