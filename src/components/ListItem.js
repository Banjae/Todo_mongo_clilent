import axios from "axios";
import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData, deleteClick }) => {
  // console.log("ListItem Rendering");

  // 현재 편집 중인지 아닌지를 관리하는 state 생성
  // isEditing false => 목록 보여짐
  // isEditing true  => 편집 보여짐
  const [isEditing, setIsEditing] = useState(false);
  // 편집창 초기값은 타이틀이 먼저 있어야함
  const [editedTitle, setEditedTitle] = useState(item.title);

  // const deleteClick = (id) => {
  //   // 클릭된 id와 다른 요소들만 걸러서 새로운 배열 생성
  //   const nowTodo = todoData.filter((item) => item.id !== id);
  //   // console.log("Click", nowTodo);
  //   setTodoData(nowTodo)
  // };

  const toggleClick = (id) => {
    //  map를 통해 this.state.todoData의 complete를 업데이트
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        item.completed = !item.completed;
      }
      return item;
    });
    let body = {
      id: todoId,
      completed: item.completed,
    };
    // axios MongoDB
    // them() : 서버에서 회신이 왔을 떄 처리
    // catch() : 서버에서 응답이 없을 떄 처리
    axios
      .post("/api/post/updatetoggle", body)
      .then((res) => {
        console.log(res);
        setTodoData(updateTodo);
      })
      .catch((err) => {
        console.log(err);
      });
    // 로컬에 저장한다.
    // localStorage.setItem("todoData", JSON.stringify(updateTodo));
  };

  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const todoId = item.id;
  const updateTitle = () => {
    // 공백 문자열 제거 추가
    let str = editedTitle;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("할 일을 입력하세요.");
      setEditedTitle("");
      return;
    }

    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 ID와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정
        item.title = editedTitle;
      }
      return item;
    });

    // 데이터 갱신
    let body = {
      id: item.id,
      title: editedTitle,
    };
    // axios MongoDB
    axios
      .post("/api/post/updatetitle", body)
      .then((res) => {
        console.log(res);
        setTodoData(tempTodo);
        // 목록창으로 이동
        setIsEditing(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // 로컬에 저장한다.(DB 예정)
    // localStorage.setItem("todoData", JSON.stringify(tempTodo));
  };

  // 날짜 출력
  const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
  const showTime = (_timestamp) => {
    const date = new Date(_timestamp);
    // 시간 오전, 오후
    let hours = date.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours + 1 < 9 ? "0" + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let time = date.getFullYear();
    time += " / ";
    time += date.getMonth() + 1;
    time += " / ";
    time += date.getDate();
    time += " / ";
    time += WEEKDAY[date.getDay()];
    time += " ";
    time += hours;
    time += ":";
    time += minutes;
    time += ":";
    time += seconds;
    time += " ";
    time += ampm;

    return time;
  };

  if (isEditing) {
    return (
      <>
        <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
          <div className="items-center">
            <input
              type="text"
              className="w-full px-3 py-2 mr-4 text-gray-500 bg-white border rounded"
              value={editedTitle}
              onChange={editChange}
            />
          </div>
          <div className="items-center">
            <button className="px-4 py-2" onClick={updateTitle}>
              Update
            </button>
            <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
              Close
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
          <div className="items-center">
            <input
              type="checkbox"
              defaultChecked={item.completed}
              onChange={() => toggleClick(item.id)}
            />{" "}
            <span className={item.completed ? "line-through" : "none"}>
              {item.title}
            </span>
          </div>
          <div className="items-center">
            <span>{showTime(item.id)}</span>
            <button
              className="px-4 py-2"
              onClick={() => {
                setIsEditing(true);
                setEditedTitle(item.title);
              }}
            >
              Edit
            </button>
            <button className="px-4 py-2" onClick={() => deleteClick(item.id)}>
              X
            </button>
          </div>
        </div>
      </>
    );
  }
});

export default ListItem;
