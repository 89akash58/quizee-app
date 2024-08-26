import React from "react";
import styles from "./QAAnalysis.module.css";

const QAWiseAnalysis = ({ quiz }) => {
  const createdAtDate = new Date(quiz.createdAt);
  const formattedDate = `${String(createdAtDate.getDate()).padStart(
    2,
    "0"
  )} ${createdAtDate.toLocaleString("default", { month: "short" })}, ${String(
    createdAtDate.getFullYear()
  )}`;

  // console.log(quiz);
  return (
    <div className={styles.QAAnalysis_container}>
      <div className={styles.header}>
        <p>{quiz.quizName} Question Analysis</p>
        <div>
          <p>Created on : {formattedDate}</p>
          <p>Impressions : {quiz.totalImpressions}</p>
        </div>
      </div>

      {quiz.questionSets.map((question, idx) => {
        return (
          <div className={styles.display_question} key={idx}>
            <p>
              Q.{idx + 1} {question.pollQuestion}
            </p>
            <div>
              <div>
                <p>{question.totalAttempted}</p>
                <p>people Attempted the question</p>
              </div>
              <div>
                <p>{question.totalCorrect}</p>
                <p>people Answered Correctly</p>
              </div>
              <div>
                <p>{question.totalIncorrect}</p>
                <p>people Answered Incorrectly</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QAWiseAnalysis;
