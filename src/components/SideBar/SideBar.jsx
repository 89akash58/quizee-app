import React, { useState } from "react";
import styles from "./SideBar.module.css";
import { useNavigate } from "react-router-dom";
import Question from "../../model/Question";
import Option from "../../model/Option";

const Sidebar = ({
  setQuizId,
  setQAAnalysis,
  setPollAnalysis,
  setDashboard,
  setAnalytics,
  setLogoutMessage,
  setCreateQuizPage,
  setCreateQuizPopup,
  setQuestionSetsPopup,
  setQuizPublished,
  setQuizType,
  setQuestionSets,
  setTimer,
  setPollQuestion,
  setOptionType,
  setOptionSets,
}) => {
  const [active1, setActive1] = useState(true);
  const [active2, setActive2] = useState(false);
  let navigate = useNavigate();

  const navigateDashboard = () => {
    setQAAnalysis(false);
    setPollAnalysis(false);
    setDashboard(true);
    setAnalytics(false);
    setActive1(true);
    setActive2(false);
  };

  const navigateAnalytics = () => {
    setQAAnalysis(false);
    setPollAnalysis(false);
    setDashboard(false);
    setAnalytics(true);
    setActive1(false);
    setActive2(true);
  };

  const navigateCreateQuiz = () => {
    setQuizId();
    setQuizType();
    setQuestionSets([new Question()]);
    setTimer(0);
    setOptionSets([new Option(), new Option()]);
    setPollQuestion("");
    setOptionType("Text");
    setQuizPublished(false);
    setCreateQuizPage(true);
    setQuestionSetsPopup(false);
    setCreateQuizPopup(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setLogoutMessage("You are Logged Out Successfully");
  };
  return (
    <div className={styles.sidebar_container}>
      <div className={styles.sidebar_container_heading}>
        <h1>QUIZZIE</h1>
      </div>
      <div className={styles.sidebar_container_buttons}>
        <div className={`${active1 && styles.bg}`} onClick={navigateDashboard}>
          Dashboard
        </div>
        <div className={`${active2 && styles.bg}`} onClick={navigateAnalytics}>
          Analytics
        </div>
        <div onClick={navigateCreateQuiz} title="Create Quiz">
          Create Quiz
        </div>
      </div>
      <div className={styles.sidebar_container_logout_div}>
        <div></div>
        <div onClick={handleLogout}>LOGOUT</div>
      </div>
    </div>
  );
};

export default Sidebar;
