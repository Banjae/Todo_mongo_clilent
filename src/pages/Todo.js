import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";

/* 
최초에 로컬에서 todoData를 읽어와서 
todoData 라는 useState를 초기화 해주어야 한다.
초기값을 로컬에서 불러와서 채워준다.
*/
// 로컬스토리지에서 내용을 읽어옴
// MongoDB에서 목록을 읽어옴
// let initTodo = localStorage.getItem("todoData");
// // 삼항연산자를 이용해서 초기값이 없으면
// // 빈배열 [] 로 초기화한다.
// // 읽어온 데이터가 있으면 JSON.stringify() 저장한 파일을
// // JSON.parse() 로 다시 객체화하여 사용한다.
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
  // console.log("Todo Rendering...");
  // MongoDB에서 초기값 읽어서 세팅
  // axios 및 useEffect를 이용
  // const [todoData, setTodoData] = useState(initTodo);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  // axios 이용해서 서버 API 호출
  useEffect(() => {
    axios
      .post("/api/post/list")
      .then((res) => {
        // console.log(response.data);
        // 초기 할일 데이터 세팅
        if (res.data.success) {
          setTodoData(res.data.initTodo);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // 초기데이터를 컴포넌트가 마운트 될때 한번 실행
  }, []);

  const deleteClick = useCallback(
    (id) => {
      // 클릭된 id와 다른 요소들만 걸러서 새로운 배열 생성
      const nowTodo = todoData.filter((item) => item.id !== id);
      // console.log("Click", nowTodo);
      // 목록을 갱신한다
      // axios 이용해서 MongoDB 삭제 진행
      setTodoData(nowTodo);
      // 로컬에 저장한다 (DB 예정)
      localStorage.setItem("todoData", JSON.stringify(nowTodo));
    },
    [todoData]
  );

  const addTodoSubmit = (event) => {
    event.preventDefault();

    // 공백 문자열 제거 추가
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("내용을 입력하세요.");
      setTodoValue("");
      return;
    }

    const addTodo = {
      id: Date.now(),
      title: todoValue,
      completed: false,
    };
    // todoData : []
    // axios MongoDB

    axios
      .post("/api/post/submit", { ...addTodo })
      .then((응답) => {
        console.log(응답.data);
        if (응답.data.success) {
          setTodoData([...todoData, addTodo]);
          setTodoValue("");
          alert("할일이 등록되었습니다");
        } else {
          alert("할일 등록 실패하였습니다");
        }
      })
      .catch((에러) => {
        console.log(에러);
      });

    // setTodoData([...todoData, addTodo]);
    // 로컬에 저장한다.(DB 예정)
    // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));
    // setTodoValue("");
  };

  const deleteAllClick = () => {
    setTodoData([]);
    // 자료를 지운다.(DB 초기화)
    localStorage.clear();
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full p-6 m-4 bg-white rounded shadow">
        <div className="flex justify-between mb-3">
          <h1> 할일 목록</h1>
          <button onClick={deleteAllClick}>핵폭탄</button>
        </div>

        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />

        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
    </div>
  );
};

export default Todo;
