import React, { useEffect, useState } from "react";
import styles from "./PlayQuiz.module.css";
import Loader from "../../components/Loader/Loader";
import QnAQuizResult from "../../components/QAResult/QAResult";
import PollQuizResult from "../../components/PollQuizResult/PollQuizResult";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Playquiz = () => {
  const [quizData, setQuizData] = useState();
  const { playQuizId } = useParams();
  let [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState();
  const [timer, setTimer] = useState(undefined);
  let [score, setScore] = useState(0);
  const [showQnAQuizResult, setQnAQuizResult] = useState(false);
  const [showPollQuizResult, setPollQuizResult] = useState(false);
  const [showGameSection, setGameSection] = useState(true);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://backend-quizapp-jrqf.onrender.com/playQuiz/${playQuizId}`)
      .then((response) => {
        // console.log("Quiz Data:", response.data.quiz); // Log the quiz data

        setQuizData(response.data.quiz);
        if (
          response.data.quiz.quizType === "Q&A" &&
          response.data.quiz.questionSets.length > 0
        ) {
          const firstQuestionTimer = response.data.quiz.questionSets[0].timer;
          console.log("First Question Timer:", firstQuestionTimer); // Log the timer value

          setTimer(firstQuestionTimer > 0 ? firstQuestionTimer : undefined);
        }
      })
      .catch((error) => {
        if (error.response.status === 404 || error.response.status === 400) {
          navigate("/notFound");
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoclose: 1000,
        });
        console.error(error);
      });
  }, [navigate, playQuizId]);

  useEffect(() => {
    if (quizData && timer !== undefined) {
      if (timer > 0) {
        const intervalId = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(intervalId);
      } else {
        console.log("Timer ended, moving to next question."); // Log when timer ends

        handleNextForQandA();
      }
    }
  }, [timer, quizData]);

  const formattedTimer = `${String(timer % 60).padStart(2, "0")}`;

  if (!quizData) {
    return <Loader />;
  }

  const submitQuiz = () => {
    if (loading) {
      return;
    }
    setLoading(true);

    axios
      .put(
        `https://backend-quizapp-jrqf.onrender.com/playQuiz/${playQuizId}`,
        { questionSets: quizData.questionSets },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (error.response.status === 404 || error.response.status === 400) {
          navigate("/notFound");
        }
        toast.error(error.response.data.message, {
          position: "top-center",
          autoclose: 2000,
        });
        console.error(error);
        setLoading(false);
      });
  };

  const handleNextForQandA = () => {
    if (selectedOption && selectedOption.isCorrectAnswer === true) {
      setScore((prevScore) => prevScore + 1);
      quizData.questionSets[currentIndex].totalAttempted += 1;
      quizData.questionSets[currentIndex].totalCorrect += 1;
    } else if (selectedOption && selectedOption.isCorrectAnswer === false) {
      quizData.questionSets[currentIndex].totalAttempted += 1;
      quizData.questionSets[currentIndex].totalIncorrect += 1;
    } else {
      quizData.questionSets[currentIndex].totalIncorrect += 1;
    }

    if (currentIndex < quizData.questionSets.length - 1) {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        console.log("Next Index:", nextIndex);
        if (
          quizData.questionSets[nextIndex] &&
          quizData.questionSets[nextIndex].timer !== undefined
        ) {
          console.log(
            "Next Question Timer:",
            quizData.questionSets[nextIndex].timer
          );

          setTimer(quizData.questionSets[nextIndex].timer);
        } else {
          setTimer(undefined);
        }
        return nextIndex;
      });
      setSelectedOptionIndex(undefined);
      setSelectedOption(undefined);
    } else {
      // Finish quiz
      setTimer(undefined);
      console.log("Quiz completed.");

      submitQuiz();
      setQnAQuizResult(true);
      setGameSection(false);
    }
  };

  const handleNextForPoll = () => {
    if (selectedOption) {
      quizData.questionSets[currentIndex].optionSets[
        selectedOptionIndex
      ].optionPollCount += 1;
    }
    if (quizData.questionSets.length - 1 > currentIndex) {
      setCurrentIndex(++currentIndex);
      setSelectedOptionIndex();
      setSelectedOption();
    } else {
      submitQuiz();
      setPollQuizResult(true);
      setGameSection(false);
    }
  };

  const handleOptionSelect = (option, index) => {
    setSelectedOption(option);
    setSelectedOptionIndex(index);
  };

  const totalQuestions = `${String(quizData.questionSets.length).padStart(
    2,
    "0"
  )}`;
  const formattedIndex = `${String(currentIndex + 1).padStart(2, "0")}`;

  return (
    <div className={styles.playQuiz_container}>
      {showGameSection && (
        <div className={styles.play_quiz}>
          <section className={styles.section_1}>
            <span>
              {formattedIndex}/{totalQuestions}
            </span>
            {timer !== undefined && timer > 0 && (
              <span className={styles.timer}>00:{formattedTimer}s</span>
            )}
          </section>
          <h1>{quizData.questionSets[currentIndex].pollQuestion}</h1>
          <section className={styles.section_2}>
            {quizData.questionSets[currentIndex].optionSets.map(
              (option, index) => {
                console.log("Option:", option);
                return (
                  <div
                    key={index}
                    className={
                      index === selectedOptionIndex ? styles.selectedOption : ""
                    }
                    onClick={() => handleOptionSelect(option, index)}
                  >
                    {option.optionText && option.optionText.length > 0 && (
                      <div>{option.optionText}</div>
                    )}
                    {option.optionImageUrl &&
                      option.optionImageUrl.length > 0 && (
                        <div>
                          <img
                            src={option.optionImageUrl}
                            className={styles.image_url}
                            alt="Option"
                            onError={(e) => {
                              e.target.style.display = "none";
                              console.error("Image load error:", e);
                            }}
                          />
                        </div>
                      )}
                  </div>
                );
              }
            )}
          </section>
          <button
            onClick={
              quizData.quizType === "Q&A"
                ? handleNextForQandA
                : handleNextForPoll
            }
          >
            {loading
              ? "Please Wait..."
              : quizData.questionSets.length - 1 > currentIndex
              ? "Next"
              : "Submit"}
          </button>
        </div>
      )}

      {showQnAQuizResult && (
        <QnAQuizResult
          score={score}
          totalQuestions={quizData.questionSets.length}
        />
      )}
      {showPollQuizResult && <PollQuizResult />}

      <ToastContainer />
    </div>
  );
};

export default Playquiz;
