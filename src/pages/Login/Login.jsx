import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";

const Login = ({ logoutMessage, setLogoutMessage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleName = (e) => setName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const registerUserObject = {
    name,
    email,
    password,
    confirmPassword,
  };

  const loginUserObject = {
    email,
    password,
  };

  const validateName = () => {
    let regex = new RegExp("^[a-zA-Z\\s]*$");
    if (regex.test(name) === false) {
      toast.error("Name must be in characters", {
        position: "top-center",
        autoClose: 2000,
      });
      return true;
    }
    return false;
  };

  const validateEmail = () => {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email", {
        position: "top-center",
        autoClose: 2000,
      });
      return true;
    }
    return false;
  };

  const validatePassword = () => {
    let regex = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    if (regex.test(password) === false) {
      toast.error(
        "Password must have 1 lowercase,1 uppercase,1 special character and must have 8 charcters",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      return true;
    }
    return false;
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      toast.error("Password and confirm password doesnot match", {
        position: "top-center",
        autoClose: 2000,
      });
      return true;
    }
    return false;
  };

  const validateAllFields = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are mandatory", {
        position: "top-center",
        autoClose: 2000,
      });
      return true;
    }
    return false;
  };

  const validateLoginFields = () => {
    if (!email || !password) {
      toast.error("All fields are mandatory", {
        position: "top-center",
        autoClose: 1000,
      });
      return true;
    }
    return false;
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      validateAllFields() ||
      validateName() ||
      validateEmail() ||
      validatePassword() ||
      validateConfirmPassword()
    ) {
      return;
    }

    setLoading(true);

    axios
      .post(
        `https://backend-quizapp-jrqf.onrender.com/register`,
        registerUserObject,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        setLogin(false);
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        console.log(error);

        // Check if error.response is defined
        if (error.response && error.response.data) {
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 5000,
          });
        } else {
          toast.error("An error occurred. Please try again later.", {
            position: "top-center",
            autoClose: 5000,
          });
        }

        setLoading(false);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (loading) return;

    if (validateEmail() || validatePassword()) {
      return;
    }

    setLoading(true);

    axios
      .post(
        `https://backend-quizapp-jrqf.onrender.com/login`,
        loginUserObject,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        localStorage.setItem("jwtToken", response.data.token);
        // console.log(response.data);
        localStorage.setItem("quizOwnerId", response.data.userId);
        localStorage.setItem("userName", response.data.name);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    logoutMessage &&
      toast.success(logoutMessage, {
        position: "top-center",
        autoClose: 1000,
      });
    setLogoutMessage("");
  }, []);

  const handleSignUpButton = () => {
    setLogin(true);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLoginButton = () => {
    setLogin(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.form_container}>
        <h1>QUIZZIE</h1>
        <div className={styles.btns_container}>
          <div
            className={`${styles.signup_btn} ${login && styles.shadow}`}
            onClick={handleSignUpButton}
          >
            Sign Up
          </div>
          <div
            className={`${styles.login_btn} ${!login && styles.shadow}`}
            onClick={handleLoginButton}
          >
            Log In
          </div>
        </div>
        <form onSubmit={login ? handleSignUp : handleLogin}>
          {login && (
            <>
              <div>
                <label htmlFor="name" className={styles.name}>
                  Name
                </label>
                <input
                  type="text"
                  className={styles.name_input}
                  name="name"
                  value={name}
                  onChange={handleName}
                />
              </div>
              <br />
            </>
          )}
          <div>
            <label htmlFor="email" className={styles.email}>
              Email
            </label>
            <input
              type="email"
              className={styles.email_input}
              name="email"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <br />
          <div>
            <label htmlFor="password" className={styles.password}>
              Password
            </label>
            <input
              type="password"
              className={styles.password_input}
              name="password"
              value={password}
              onChange={handlePassword}
            />
          </div>
          <br />
          {login && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={styles.confirmPassword}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={styles.confirmPassword_input}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPassword}
                />
              </div>
              <br />
              <br />
            </>
          )}
          <div>
            <button className={styles.signup_login_btn}>
              {loading ? "Please Wait..." : login ? "Sign-Up" : "Login"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Login;
