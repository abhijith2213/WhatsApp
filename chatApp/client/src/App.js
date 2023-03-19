import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "./components/login/Login";
import UserStructure from "./pages/UserStructure";
import Signup from "./components/signup/Signup";
import ChatInterface from "./pages/ChatInterface";
import UserProvider from "./context/UserDetailsProvider";
import ProtectedRoute from "./utils/ProtectedRoutes";

function App() {
  return (
    <div className="App">
      <Router>
          <UserProvider>
        <Routes>
          <Route element={<UserStructure/>}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/create" element={<Signup/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<ChatInterface/>}/>
          </Route>
        </Routes>
          </UserProvider>
      </Router>
    </div>
  );
}

export default App;
