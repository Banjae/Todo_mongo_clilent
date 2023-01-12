import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpDiv from "../styles/signUpCss";
// firebase 기본 코드 포함
import firebase from "../firebase";
import axios from "axios";

const SignUp = () => {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");

  // 연속버튼클릭 막기
  const [btFlag, setBtFlag] = useState(false);

  const navigte = useNavigate();

  // firebase 회원가입 기능
  const registFunc = (e) => {
    e.preventDefault();
    // 각 항목을 입력했는지 체크
    if (!nickName) {
      return alert("닉네임을 입력하세요");
    }
    if (!email) {
      return alert("이메일을 입력하세요");
    }
    if (!pw) {
      return alert("비밀번호를 입력하세요");
    }
    if (!pwCheck) {
      return alert("비밀번호 확인을 입력하세요");
    }
    // 비밀번호가 같은지 비교처리
    if (pw !== pwCheck) {
      return alert("비밀번호가 다릅니다");
    }
    // 닉네임 검사 요청
    if (!nameCheck) {
      return alert("닉네임 중복검사를 해주세요");
    }

    // 연속클릭 막기
    setBtFlag(true);

    // firebase로 이메일과 비밀번호 전송
    // https://firebase.google.com/docs/auth/web/start?hl=ko&authuser=3#web-version-9_1
    const createUser = firebase.auth();
    createUser
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // 가입 성공
        const user = userCredential.user;
        // console.log(user);
        // 사용자 프로필 displayName 업데이트
        // https://firebase.google.com/docs/auth/web/manage-users
        user
          .updateProfile({ displayName: nickName })
          .then(() => {
            // 데이터베이스로 정보 저장
            // 사용자 정보를 저장한다(이메일, 닉네임, UID)
            let body = {
              email: user.email,
              displayName: user.displayName,
              uid: user.uid,
            };
            axios
              .post("/api/user/register", body)
              .then((res) => {
                // console.log(res.data);
                if (res.data.success) {
                  // 가입 후 강제 로그아웃
                  firebase.auth().signOut();
                  // 회원정보 저장 성공
                  navigte("/login");
                } else {
                  // 회원정보 저장 실패
                  console.log("회원정보 저장 실패시 다시 시도");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {});
      })
      .catch((error) => {
        // 연속클릭 막기
        setBtFlag(false);
        // 가입 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  // 이름 중복 검사
  const [nameCheck, setNameCheck] = useState(false);
  const nameCheckFn = (e) => {
    e.preventDefault();
    if (!nickName) {
      alert("닉네임을 입력해 주세요");
    }
    // 데이터베이스 서버 UseModel에서 닉네임 존재 여부 파악
    const body = {
      displayName: nickName,
    };
    axios
      .post("/api/user/namecheck", body)
      .then((res) => {
        if (res.data.success) {
          if (res.data.check) {
            // 등록가능
            setNameCheck(true);
            alert("등록이 가능합니다");
          } else {
            // 등록 불가능
            setNameCheck(false);
            alert("이미 등록된 닉네임입니다");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-6 m-4 shadow">
      <h2>SignUp</h2>
      <SignUpDiv>
        <form>
          <label>닉네임</label>
          <input
            type="text"
            value={nickName}
            minLength={3}
            maxLength={20}
            onChange={(e) => setNickName(e.target.value)}
          />
          <button onClick={(e) => nameCheckFn(e)}>닉네임 중복검사</button>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>비밀번호</label>
          <input
            type="password"
            value={pw}
            minLength={8}
            maxLength={16}
            onChange={(e) => setPw(e.target.value)}
          />
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={pwCheck}
            minLength={8}
            maxLength={16}
            onChange={(e) => setPwCheck(e.target.value)}
          />
          <button disabled={btFlag} onClick={(e) => registFunc(e)}>
            가입
          </button>
        </form>
      </SignUpDiv>
    </div>
  );
};

export default SignUp;
