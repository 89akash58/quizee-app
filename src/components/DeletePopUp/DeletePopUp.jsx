import React, { useState } from "react";
import styles from "./DeletePopUp.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DeletePopup = ({ setDeletePopup, quizId, listQuizzes }) => {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  // console.log("quiz-id" + quizId);

  const handleDelete = () => {
    if (loading) return;

    setLoading(true);

    axios
      .delete(`https://backend-quizapp-jrqf.onrender.com/${quizId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwtToken"),
        },
      })
      .then((response) => {
        // console.log(response);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
        setDeletePopup(false);
        listQuizzes();
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
            navigate("/");
          }, 2000);
          return;
        }
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });
        setLoading(false);
      });
  };

  return (
    <div className={styles.deletePopup_container}>
      <div className={styles.deleteQuiz_popup}>
        <p>Are you confirm you want to delete</p>
        <div className={styles.btn_container}>
          <button onClick={handleDelete}>
            {loading ? "Please Wait..." : "Confirm Delete"}
          </button>
          <button
            onClick={() => {
              setDeletePopup(false);
              listQuizzes();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeletePopup;
