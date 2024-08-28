import { useState } from "react";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import PlayQuiz from "./pages/PlayQuiz/PlayQuiz";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [logoutMessage, setLogoutMessage] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/quizee-app"
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
          <Route path="/playQuiz/:playQuizId" element={<PlayQuiz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
