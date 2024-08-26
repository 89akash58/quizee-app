import React, { useEffect, useState } from "react";
import styles from "./CreateQuiz.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cross from "../../assets/cross.png";
import deleteIcon from "../../assets/delete.png";
import copy from "copy-to-clipboard";
import { useNavigate, useLocation } from "react-router-dom";
import Question from "../../model/Question";
import Option from "../../model/Option";
import config from "../CreateQuiz/config";
const CreateQuiz = ({
  quizId,
  quizType,
  setQuizType,
  setCreateQuizPage,
  showCreateQuizPopup,
  showQuestionSetsPopup,
  setCreateQuizPopup,
  setQuestionSetsPopup,
  showQuizPublished,
  setQuizPublished,
  questionSets,
  setQuestionSets,
  pollQuestion,
  setPollQuestion,
  optionType,
  setOptionType,
  optionSets,
  setOptionSets,
  listQuizzes,
}) => {
  //console.log(questionSets);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [quizName, setQuizName] = useState("");
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [active3, setActive3] = useState(true);
  // const [active4, setActive4] = useState(false);
  // const [active5, setActive5] = useState(false);

  const quizOwnerId = localStorage.getItem("quizOwnerId");

  const handleQuizName = (e) => setQuizName(e.target.value);
  // useEffect(() => {
  //   console.log("Initial optionSets:", optionSets);
  // }, []);

  // useEffect(() => {
  //   console.log("Updated optionSets:", optionSets);
  // }, [optionSets]);
  const handleQA = () => {
    setQuizType("Q&A");
    setActive1(true);
    setActive2(false);
  };

  const handlePollType = () => {
    setQuizType("Poll Type");
    setActive1(false);
    setActive2(true);
  };

  // const handleTimerOff = () => {
  //   setTimer(0);
  //   setActive3(true);
  //   setActive4(false);
  //   setActive5(false);
  // };

  // const handleTimerFiveSec = () => {
  //   setTimer(5);
  //   setActive3(false);
  //   setActive4(true);
  //   setActive5(false);
  // };

  // const handleTimerTenSec = () => {
  //   setTimer(10);
  //   setActive3(false);
  //   setActive4(false);
  //   setActive5(true);
  // };

  const handleContinue = () => {
    if (quizName && quizName.trim().length > 0 && quizType) {
      setCreateQuizPopup(false);
      setQuestionSetsPopup(true);
    } else {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  const handlePollQuestion = (e) => {
    setPollQuestion(e.target.value);
    questionSets[currentQuestionIndex].pollQuestion = e.target.value;
  };

  const handleAddQuestion = () => {
    if (questionSets.length < 5) {
      setPollQuestion("");
      setOptionType("Text");
      setOptionSets((prevOptionSets) => [new Option(), new Option()]);
      setQuestionSets((prevQuestionSets) => [
        ...prevQuestionSets,
        new Question(),
      ]);
      setCurrentQuestionIndex(questionSets.length); // So if you are at any page, it will go to the last page
    }
  };

  const handleQuestionNoChange = (index) => {
    setPollQuestion(
      questionSets[index].pollQuestion ? questionSets[index].pollQuestion : ""
    );
    setOptionType(
      questionSets[index].optionType ? questionSets[index].optionType : "Text"
    );
    setOptionSets(
      questionSets[index].optionSets
        ? questionSets[index].optionSets
        : [new Option(), new Option()]
    );
    setCurrentQuestionIndex(index);
  };

  const handleQuestionDelete = (index) => {
    const updatedQuestions = questionSets.filter((_, i) => i !== index); // filter out that index
    setQuestionSets(updatedQuestions);

    const newIndex = currentQuestionIndex > 0 ? currentQuestionIndex - 1 : 0;

    // get new values from updated and reload all state of variables
    setPollQuestion(
      updatedQuestions[newIndex].pollQuestion
        ? updatedQuestions[newIndex].pollQuestion
        : ""
    );
    setOptionType(
      updatedQuestions[newIndex].optionType
        ? updatedQuestions[newIndex].optionType
        : "Text"
    );
    setOptionSets(
      updatedQuestions[newIndex].optionSets
        ? updatedQuestions[newIndex].optionSets
        : [new Option(), new Option()]
    );
    setCurrentQuestionIndex(newIndex);
  };

  const handleAddOption = () => {
    if (optionSets.length < 4) {
      const updatedOptions = [...optionSets, new Option()];
      setOptionSets(updatedOptions);

      const updatedQuestionSets = [...questionSets];
      updatedQuestionSets[currentQuestionIndex].optionSets = updatedOptions;
      setQuestionSets(updatedQuestionSets);
    }
  };

  const handleOptionTextChange = (e, questionIndex, optionIndex) => {
    const updatedOptions = [...optionSets];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      optionText: e.target.value,
    };
    setOptionSets(updatedOptions);
    questionSets[currentQuestionIndex].optionSets = updatedOptions;
  };

  const handleOptionImageUrlChange = (e, questionIndex, optionIndex) => {
    // console.log("Before change:", optionSets[optionIndex]);
    const updatedOptions = [...optionSets];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      optionImageUrl: e.target.value,
    };
    setOptionSets(updatedOptions);
    questionSets[currentQuestionIndex].optionSets = updatedOptions;
    // console.log("After change:", updatedOptions[optionIndex]);
  };

  const handleOptionDelete = (e, questionIndex, optionIndex) => {
    const updatedOptions = optionSets.filter(
      (_, index) => index !== optionIndex
    );
    setOptionSets(updatedOptions);

    const updatedQuestionSets = [...questionSets];
    updatedQuestionSets[questionIndex].optionSets = updatedOptions;
    setQuestionSets(updatedQuestionSets);
  };

  const handleCorrectAnswerChange = (e, questionIndex, optionIndex) => {
    const updatedOptions = [...optionSets];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      isCorrectAnswer: true,
    };

    updatedOptions
      .filter((_, index) => index !== optionIndex)
      .forEach((u) => (u.isCorrectAnswer = false)); //make other options isCorrectAnswer = false
    setOptionSets(updatedOptions);
    questionSets[currentQuestionIndex].optionSets = updatedOptions;
  };

  const handleOptionType = (e) => {
    setOptionType(e.target.value);
    questionSets[currentQuestionIndex].optionType = e.target.value;

    const updatedOptions = optionSets.map((o) => {
      if (e.target.value === "Text") {
        // If test selected, clear optionImageUrl values
        return { ...o, optionImageUrl: "" };
      } else if (e.target.value === "Image URL") {
        return { ...o, optionText: "" };
      }
      return o;
    });

    setOptionSets(updatedOptions);
    setQuestionSets((prevQuestionSets) => {
      const updatedQuestionSets = [...prevQuestionSets];
      updatedQuestionSets[currentQuestionIndex].optionSets = updatedOptions;
      return updatedQuestionSets;
    });
  };

  const createQuizObject = {
    quizOwnerId,
    quizName,
    quizType,
    questionSets,
  };

  const validateRequiredFields = () => {
    // Check if pollQuestion is empty for any question
    if (
      questionSets.some(
        (question) =>
          !question.pollQuestion || question.pollQuestion.trim().length === 0
      )
    ) {
      return false;
    }

    // Check if any Text or Text & Image URL optionText is empty
    if (
      questionSets.some(
        (q) =>
          (q.optionType === "Text" || q.optionType === "Text & Image URL") &&
          q.optionSets.some(
            (o) => !o.optionText || o.optionText.trim().length === 0
          )
      )
    ) {
      return false;
    }

    // Check if any Text or Text & Image URL optionImageUrl is empty
    if (
      questionSets.some(
        (q) =>
          (q.optionType === "Image URL" ||
            q.optionType === "Text & Image URL") &&
          q.optionSets.some(
            (o) => !o.optionImageUrl || o.optionImageUrl.trim().length === 0
          )
      )
    ) {
      return false;
    }

    return true;
  };
  const setDefaultOptionTypeValue = () => {
    setQuestionSets((prevQuestionSets) => {
      const updatedQuestionSets = prevQuestionSets.map((q) => {
        if (!q.optionType) {
          return {
            ...q,
            optionType: "Text",
            optionSets: q.optionSets || [], // Ensure optionSets exists
          };
        }
        return q;
      });
      return updatedQuestionSets;
    });
  };

  const createQuiz = () => {
    axios
      .post(
        "https://backend-quizapp-jrqf.onrender.com/create",
        createQuizObject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        listQuizzes();
        localStorage.setItem("quizId", response.data.quizId);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
        setQuestionSetsPopup(false);
        setQuizPublished(true);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error(
              "Invalid Session or Session expired. Please Log In again",
              {
                position: "top-center",
                autoClose: 2000,
              }
            );
            localStorage.clear();
            setTimeout(() => {
              navigate("/quizee-app");
            }, 2000);
            return;
          }
          console.error(error);
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 2000,
          });
        } else if (error.request) {
          console.error("No response received:", error.request);
          toast.error("No response from server", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          console.error("Error:", error.message);
          toast.error("An error occurred. Please try again.", {
            position: "top-center",
            autoClose: 2000,
          });
        }
        setLoading(false);
      });
  };

  const editQuiz = async () => {
    await resetCountsToZeroIfAnyQuestionsChanged();

    //api call
    // console.log(localStorage.getItem("jwtToken"));
    axios
      .put(
        `https://backend-quizapp-jrqf.onrender.com/${quizId}`,
        { questionSets },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
        }
      )
      .then((response) => {
        listQuizzes();
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        setCreateQuizPage(false);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast.error(
            "Invalid Session or Session expired. Please Log In again",
            {
              position: "top-center",
              autoClose: 2000,
            }
          );
          localStorage.clear();
          setTimeout(() => {
            navigate("/quizee-app");
          }, 2000);
          return;
        }
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      });
  };

  const resetCountsToZeroIfAnyQuestionsChanged = async () => {
    try {
      // Get object from db

      const response = await axios.get(
        `https://backend-quizapp-jrqf.onrender.com/${quizId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwtToken"),
          },
        }
      );
      // console.log(response.data);
      if (
        response.data &&
        response.data.quiz &&
        response.data.quiz.questionSets
      ) {
        const questionSetsFromDb = response.data.quiz.questionSets;

        //Compare questionSets from db & questionSets from UI
        questionSets.map((q, index) => {
          if (isQuestionChanged(q, questionSetsFromDb[index])) {
            //console.log("Question changed:", q);
            q.totalAttempted = 0;
            q.totalCorrect = 0;
            q.totalIncorrect = 0;
            q.optionSets.forEach((o) => (o.optionPollCount = 0));
          }
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Invalid Session or Session expired. Please Log In again", {
          position: "top-center",
          autoClose: 2000,
        });
        localStorage.clear();
        setTimeout(() => {
          navigate("/quizee-app");
        }, 2000);
        return;
      }
      toast.error(error.response.data.message, {
        position: "top-center",
        autoclose: 2000,
      });
      console.error("Axios error:", error);
    }
  };

  const isQuestionChanged = (q1, q2) => {
    return (
      q1.pollQuestion !== q2.pollQuestion ||
      q1.optionSets.filter((o1, idx) => isOptionChanged(o1, q2.optionSets[idx]))
        .length > 0
    );
  };

  const isOptionChanged = (o1, o2) => {
    return (
      o1.optionText !== o2.optionText ||
      o1.optionImageUrl !== o2.optionImageUrl ||
      o1.isCorrectAnswer !== o2.isCorrectAnswer
    );
  };

  const handleTimerChange = (seconds) => {
    setQuestionSets((prevQuestionSets) => {
      const updatedQuestionSets = [...prevQuestionSets];
      updatedQuestionSets[currentQuestionIndex].timer = seconds;

      return updatedQuestionSets;
    });
  };

  const handleCreateQuiz = () => {
    if (loading) {
      return;
    }

    if (!validateRequiredFields()) {
      toast.error("All fields are required", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    setLoading(true);

    setDefaultOptionTypeValue();
    //console.log(createQuizObject);

    if (quizId) {
      //Edit flow

      editQuiz();
    } else {
      createQuiz();
    }
  };
  const quizUrl = `${config.BASE_URL}/playQuiz/${localStorage.getItem(
    "quizId"
  )}`;

  // https://89akash58.github.io/home
  const shareButton = () => {
    copy(quizUrl);
    toast.success("Link copied to Clipboard", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className={styles.createQuiz_container}>
      {showCreateQuizPopup && (
        <div className={styles.createQuiz_popup}>
          <div>
            <input
              type="text"
              name="quizName"
              value={quizName}
              onChange={handleQuizName}
              placeholder="Quiz name"
              className={styles.quizName_input}
            />
          </div>
          <div>
            <span>Quiz Type</span>
            <span
              className={`${styles.q_a} ${active1 && styles.bgGreen}`}
              onClick={handleQA}
            >
              Q & A
            </span>
            <span
              className={`${styles.poll_type} ${active2 && styles.bgGreen}`}
              onClick={handlePollType}
            >
              Poll Type
            </span>
          </div>
          <div className={styles.btns_container}>
            <button
              onClick={() => {
                setCreateQuizPage(false);
                listQuizzes();
              }}
            >
              Cancel
            </button>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </div>
      )}

      {showQuestionSetsPopup && (
        <div className={styles.questionSets_popup}>
          <div className={styles.question_numbers}>
            <div>
              {questionSets.map((question, index) => (
                <div key={index} className={styles.add}>
                  <span
                    className={styles.question_number}
                    onClick={() => handleQuestionNoChange(index)}
                    style={{
                      border:
                        index === currentQuestionIndex
                          ? "2px solid #5076FF"
                          : "",
                    }}
                  >
                    {index + 1}
                  </span>
                  {questionSets.length > 1 && !quizId && (
                    <img
                      src={cross}
                      alt="cross"
                      className={styles.cross_question}
                      onClick={() => handleQuestionDelete(index)}
                    />
                  )}
                </div>
              ))}

              {questionSets.length < 5 && !quizId && (
                <div>
                  <span className={styles.plus_btn} onClick={handleAddQuestion}>
                    +
                  </span>
                </div>
              )}
            </div>

            <div>
              {!quizId && (
                <span className={styles.max_questions}>Max 5 questions</span>
              )}
            </div>
          </div>

          <div className={styles.questions_details}>
            <div className={styles.pollQuestion_input_div}>
              <input
                type="text"
                name="pollQuestion"
                className={styles.pollQuestion_input}
                onChange={handlePollQuestion}
                value={pollQuestion}
                placeholder="Poll Question"
              />
            </div>

            {!quizId && (
              <div className={styles.select_optionType}>
                <div>
                  <span>Option Type</span>
                </div>

                <div>
                  <input
                    type="radio"
                    className={styles.radio1}
                    checked={optionType === "Text"}
                    name="Option Type"
                    value="Text"
                    onChange={handleOptionType}
                  />
                  <span>Text</span>
                </div>

                <div>
                  <input
                    type="radio"
                    className={styles.radio1}
                    checked={optionType === "Image URL"}
                    name="Option Type"
                    value="Image URL"
                    onChange={handleOptionType}
                  />
                  <span>Image URL</span>
                </div>

                <div>
                  <input
                    type="radio"
                    className={styles.radio1}
                    checked={optionType === "Text & Image URL"}
                    name="Option Type"
                    value="Text & Image URL"
                    onChange={handleOptionType}
                  />
                  <span>Text & Image URL</span>
                </div>
              </div>
            )}

            <div className={styles.optionSets}>
              <div>
                {(optionSets ? optionSets : [0, 1]).map(
                  (option, optionIndex) => (
                    <div key={optionIndex}>
                      {quizType === "Q&A" && (
                        <input
                          type="radio"
                          value={optionSets[optionIndex].isCorrectAnswer}
                          className={styles.radio2}
                          name="ansOption"
                          checked={
                            optionSets[optionIndex]
                              ? optionSets[optionIndex].isCorrectAnswer
                              : false
                          }
                          onChange={(e) =>
                            handleCorrectAnswerChange(
                              e,
                              currentQuestionIndex,
                              optionIndex
                            )
                          }
                        />
                      )}
                      {(optionType === "Text" ||
                        optionType === "Text & Image URL") && (
                        <input
                          type="text"
                          placeholder="Text"
                          value={optionSets[optionIndex].optionText}
                          onChange={(e) =>
                            handleOptionTextChange(
                              e,
                              currentQuestionIndex,
                              optionIndex
                            )
                          }
                          className={`${styles.text} `}
                          style={{
                            backgroundColor:
                              optionSets[optionIndex].isCorrectAnswer &&
                              "#60B84B",
                            color:
                              optionSets[optionIndex].isCorrectAnswer &&
                              "white",
                            boxShadow:
                              optionSets[optionIndex].isCorrectAnswer && "none",
                          }}
                        />
                      )}

                      {(optionType === "Image URL" ||
                        optionType === "Text & Image URL") && (
                        <>
                          {/* {console.log("this is here", optionSets[optionIndex])} */}
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={optionSets[optionIndex].optionImageUrl}
                            className={styles.text}
                            onChange={(e) =>
                              handleOptionImageUrlChange(
                                e,
                                currentQuestionIndex,
                                optionIndex
                              )
                            }
                            style={{
                              backgroundColor:
                                optionSets[optionIndex].isCorrectAnswer &&
                                "#60B84B",
                              color:
                                optionSets[optionIndex].isCorrectAnswer &&
                                "white",
                              boxShadow:
                                optionSets[optionIndex].isCorrectAnswer &&
                                "none",
                            }}
                          />
                        </>
                      )}
                      {optionIndex >= 0 && !quizId && (
                        <img
                          src={deleteIcon}
                          alt="deleteIcon"
                          className={styles.deleteIcon}
                          onClick={(e) =>
                            handleOptionDelete(
                              e,
                              currentQuestionIndex,
                              optionIndex
                            )
                          }
                        />
                      )}
                    </div>
                  )
                )}
              </div>

              {quizType === "Q&A" && !quizId && (
                <div>
                  <span>Timer</span>
                  <span
                    className={`${styles.timerOff} ${
                      questionSets[currentQuestionIndex].timer === 0 &&
                      styles.bgRed
                    }`}
                    onClick={() => handleTimerChange(0)}
                  >
                    OFF
                  </span>
                  <span
                    className={`${styles.timerOffFiveSec} ${
                      questionSets[currentQuestionIndex].timer === 5 &&
                      styles.bgRed
                    }`}
                    onClick={() => handleTimerChange(5)}
                  >
                    5 sec
                  </span>
                  <span
                    className={`${styles.timerOffTenSec} ${
                      questionSets[currentQuestionIndex].timer === 10 &&
                      styles.bgRed
                    }`}
                    onClick={() => handleTimerChange(10)}
                  >
                    10 sec
                  </span>
                </div>
              )}
            </div>

            {optionSets && optionSets.length < 4 && !quizId && (
              <div className={styles.addOption_div}>
                <button
                  className={styles.addOption_btn}
                  onClick={handleAddOption}
                >
                  Add option
                </button>
              </div>
            )}

            <div className={styles.cancel_createQuiz}>
              <button
                className={styles.cancel_btn}
                onClick={() => {
                  setCreateQuizPage(false);
                  listQuizzes();
                }}
              >
                Cancel
              </button>
              <button
                className={styles.createQuiz_btn}
                onClick={handleCreateQuiz}
              >
                {loading
                  ? "Please Wait..."
                  : quizId
                  ? "Update Quiz"
                  : "Create Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuizPublished && (
        <div className={styles.quiz_published}>
          <p
            onClick={() => {
              setCreateQuizPage(false);
              listQuizzes();
            }}
          >
            x
          </p>
          <div>
            <p>Congrats your Quiz is published!</p>
            <div>
              <input
                type="text"
                value={quizUrl}
                className={styles.quiz_url_input}
                readOnly
              />
            </div>
            <div className={styles.share_btn_div}>
              <button className={styles.share_btn} onClick={shareButton}>
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
