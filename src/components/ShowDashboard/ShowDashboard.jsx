import React from "react";
import styles from "./ShowDashboard.module.css";
import eyeIcon from "../../assets/eye_icon.png";

const ShowDashboard = ({ dashboardQuizzes, analyticsQuizzes }) => {
  const formatImpressions = (impressions) => {
    if (impressions >= 1000) return (impressions / 1000).toFixed(1) + "K";
    else {
      return impressions;
    }
  };
  return (
    <div className={styles.showDashboard_container}>
      <div>
        <div className={styles.showDashboard_container_quiz_created}>
          <p>
            <span>{analyticsQuizzes ? analyticsQuizzes.length : 0}</span>
            <span>Quiz</span>
          </p>
          <span>Created</span>
        </div>

        <div className={styles.showDashboard_container_questions_created}>
          <p>
            <span>
              {analyticsQuizzes
                ? analyticsQuizzes
                    .map((quiz) => quiz.questionSets.length)
                    .reduce((prev, curr) => prev + curr, 0)
                : 0}
            </span>
            <span>questions</span>
          </p>
          <span>Created</span>
        </div>

        <div className={styles.showDashboard_container_total_impressions}>
          <p>
            <span>
              {analyticsQuizzes
                ? formatImpressions(
                    analyticsQuizzes
                      .map((quiz) => quiz.totalImpressions)
                      .reduce((prev, curr) => prev + curr, 0)
                  )
                : 0}
            </span>
            <span>Total</span>
          </p>
          <span>Impressions</span>
        </div>
      </div>

      <div>
        <p className={styles.trending_quizs}>Trending Quizzes</p>
        <div className={styles.quizzes_displayed}>
          {dashboardQuizzes &&
            dashboardQuizzes.length > 0 &&
            dashboardQuizzes.map((quiz, idx) => {
              const createdAtDate = new Date(quiz.createdAt);
              const formattedDate = `${String(createdAtDate.getDate()).padStart(
                2,
                "0"
              )} ${createdAtDate.toLocaleString("default", {
                month: "short",
              })}, ${String(createdAtDate.getFullYear())}`;
              return (
                <div className={styles.square_quiz} key={idx}>
                  <div>
                    <span title={quiz.quizName} className={styles.quiz_name}>
                      {quiz.quizName}
                    </span>
                    <span className={styles.impressions}>
                      {quiz.totalImpressions}{" "}
                      <img
                        style={{ position: "relative", top: "2px" }}
                        src={eyeIcon}
                        alt="eye_icon"
                      />
                    </span>
                  </div>
                  <p className={styles.created_date}>
                    Created on: {formattedDate}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ShowDashboard;
