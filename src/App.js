import React, { useEffect } from "react";

// react-redux 모듈
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "./reducer/userSlice";

// firebase 모듈
import firebase from "./firebase";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserInfo from "./pages/UserInfo";
import NotFound from "./pages/NotFound";

export default function App() {
  // action 보내기
  const dispatch = useDispatch();
  // 내용 출력하기
  // const user = useSelector((state) => state.user);

  // 로그인 상태 테스트
  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      // firebase 에 로그인 시 출력 정보확인
      // console.log(userInfo);
      if (userInfo) {
        // 로그인
        // store.user.state 에 info를 저장
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        // 로그아웃
        // store.user.state 를 초기화
        dispatch(clearUser());
      }
    });
  });

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  // useEffect(() => {
  //   firebase.auth().signOut();
  // }, []);

  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
