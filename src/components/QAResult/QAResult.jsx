import React from "react";
import styles from "./QAResult.module.css";
import victoryCup from "../../assets/victory.png";

const QnAQuizResult = ({ score, totalQuestions }) => {
  const formattedScore = `${String(score).padStart(2, "0")}/${String(
    totalQuestions
  ).padStart(2, "0")}`;

  return (
    <div className={styles.result_container}>
      <div className={styles.victory_container}>
        <h1 className="headquiz">Quiz Is Completed</h1>
        <img src={victoryCup} alt="victory" />
        <h2>
          Your score is <span>{formattedScore}</span>
        </h2>
      </div>
    </div>
  );
};
export default QnAQuizResult;
