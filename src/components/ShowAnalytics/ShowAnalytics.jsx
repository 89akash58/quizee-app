import React from "react";
import styles from "./ShowAnalytics.module.css";
import editIcon from "../../assets/edit_icon.png";
import shareIcon from "../../assets/share_icon.png";
import deleteIcon from "../../assets/delete.png";
import copy from "copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowAnalytics = ({
  setQuizType,
  setCreateQuizPopup,
  setCreateQuizPage,
  setQuestionSetsPopup,
  setQuiz,
  setDashboard,
  setAnalytics,
  setDeletePopup,
  analyticsQuizzes,
  setQuizId,
  setQAAnalysis,
  setPollAnalysis,
  setQuestionSets,
  setTimer,
  setPollQuestion,
  setOptionType,
  setOptionSets,
  setQuizPublished,
}) => {
  const handleEdit = (quiz) => {
    setQuizId(quiz._id);
    setQuizType(quiz.quizType);
    setQuestionSets(quiz.questionSets);
    setPollQuestion(quiz.questionSets[0].pollQuestion);
    setOptionType(quiz.questionSets[0].optionType);
    setOptionSets(quiz.questionSets[0].optionSets);
    setTimer(quiz.timer);
    setCreateQuizPage(true);
    setQuestionSetsPopup(true);
    setCreateQuizPopup(false);
    setQuizPublished(false);
  };

  const handleQAAnalysis = (quiz) => {
    setQuiz(quiz);
    setDashboard(false);
    setAnalytics(false);
    setQAAnalysis(true);
  };

  const handlePollanalysis = (quiz) => {
    setQuiz(quiz);
    setDashboard(false);
    setAnalytics(false);
    setPollAnalysis(true);
  };

  const handleDelete = (quiz) => {
    setDeletePopup(true);
    setQuizId(quiz._id);
  };

  const handleShare = (quiz) => {
    copy(`http://localhost:3000/playQuiz/${quiz._id}`);
    toast.success("Link copied to Clipboard", {
      position: "top-right",
      autoClose: 1000,
    });
  };

  return (
    <div className={styles.showAnalytics_container}>
      {analyticsQuizzes && analyticsQuizzes.length > 0 ? (
        <>
          <h1 className={styles.heading1}>Quiz Analysis</h1>
          <div className={styles.analyticsTableContainer}>
            <div
              className={styles.analyticsTable}
              style={{ height: "68vh", overflowY: "auto" }}
            >
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Quiz Name</th>
                    <th>Created on</th>
                    <th>Impression</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsQuizzes &&
                    analyticsQuizzes.map((quiz, idx) => {
                      const createdAtDate = new Date(quiz.createdAt);
                      const formattedDate = `${String(
                        createdAtDate.getDate()
                      ).padStart(2, "0")} ${createdAtDate.toLocaleString(
                        "default",
                        { month: "short" }
                      )}, ${String(createdAtDate.getFullYear())}`;
                      return (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{quiz.quizName}</td>
                          <td>{formattedDate}</td>
                          <td>{quiz.totalImpressions}</td>
                          <td>
                            <img
                              src={editIcon}
                              alt="editIcon"
                              title="Edit Quiz"
                              className={styles.images}
                              onClick={() => handleEdit(quiz)}
                            />
                            <img
                              src={deleteIcon}
                              alt="deleteIcon"
                              title="Delete Quiz"
                              onClick={() => handleDelete(quiz)}
                              className={styles.images}
                            />
                            <img
                              src={shareIcon}
                              alt="shareIcon"
                              title="Share Quiz"
                              className={styles.images}
                              onClick={() => handleShare(quiz)}
                            />
                          </td>
                          <td>
                            <u
                              style={{
                                cursor: "pointer",
                                fontFamily: "var(--font-family-poppins)",
                              }}
                              onClick={() =>
                                quiz.quizType === "Q&A"
                                  ? handleQAAnalysis(quiz)
                                  : handlePollanalysis(quiz)
                              }
                            >
                              Question Wise Analysis
                            </u>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p className={styles.para}>
          You haven't created any Quiz, Click on Create Quiz to create your
          first Quiz
        </p>
      )}
    </div>
  );
};

export default ShowAnalytics;
