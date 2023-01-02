import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./pages/Header"
import Home from "./pages/Home"
import About from "./pages/About"
import Todo from "./pages/Todo"
import Login from "./pages/Login"
import SingUp from "./pages/SignUp"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/todo" element={<Todo/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SingUp/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </Router>
  );
}