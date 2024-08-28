import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import PlayQuiz from "./pages/PlayQuiz/PlayQuiz";

function App() {
  const [logoutMessage, setLogoutMessage] = useState("");

  return (
    <Router basename="/quizee-app">
      <Routes>
        <Route
          path="/"
          element={
            <Login
              logoutMessage={logoutMessage}
              setLogoutMessage={setLogoutMessage}
            />
          }
        />
        <Route
          path="/home"
          element={<Home setLogoutMessage={setLogoutMessage} />}
        />
        <Route path="/playQuiz/:quizId" element={<PlayQuiz />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
