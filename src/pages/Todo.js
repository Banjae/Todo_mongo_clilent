import React, { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";
// import Loading from "../components/Loading";

// 부트스트랩
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import LoadingSpinner from "../components/LoadingSpinner";

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

  // 로그인 상태 파악
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user.accessToken === "") {
      // 로그인이 안된 경우
      alert("멤버만 사용가능한 메뉴입니다.");
      navigate("/login");
    } else {
      // 로그인이 된 경우
    }
  }, [user]);

  // 목록 정렬 기능
  const [sort, setSort] = useState("최신순");
  useEffect(() => {
    setSkip(0);
    getList(search, 0);
  }, [sort]);

  // 검색 기능
  const [search, setSearch] = useState("");
  const searchHandler = () => {
    setSkip(0);
    getList(search, 0);
  };

  // axios 이용해서 서버 API 호출
  // 전체 목록 호출 메서드
  const getList = (_word = "", _stIndex = "0") => {
    setSkip(0);
    setSkipToggle(true);
    // 로딩창 보여주기
    setLoading(true);
    let body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post("/api/post/list", body)
      .then((res) => {
        // console.log(response.data);
        // 초기 할일 데이터 세팅
        if (res.data.success) {
          setTodoData(res.data.initTodo);
          setSkip(res.data.initTodo.length);
          if (res.data.initTodo.length < 5) {
            setSkipToggle(false);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getListGo = (_word = "", _stIndex = "0") => {
    // 로딩창 보여주기
    setLoading(true);
    let body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post("/api/post/list", body)
      .then((res) => {
        // console.log(response.data);
        // 초기 할일 데이터 세팅
        if (res.data.success) {
          const newArr = res.data.initTodo;
          setTodoData([...todoData, ...newArr]);
          setSkip(skip + newArr.length);
          if (newArr.length < 5) {
            setSkipToggle(false);
          }
        }
        // 로딩창 숨기기
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 목록 개수 출력
  const [skip, setSkip] = useState(0);
  const [skipToggle, setSkipToggle] = useState(true);

  const geListMore = () => {
    getListGo(search, skip);
  };

  useEffect(() => {
    getList("", skip);
    // 초기데이터를 컴포넌트가 마운트 될때 한번 실행
  }, []);

  const deleteClick = useCallback(
    (id) => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        let body = {
          id: id,
        };
        axios
          .post("/api/post/delete", body)
          .then((res) => {
            console.log(res);
            // 클릭된 id와 다른 요소들만 걸러서 새로운 배열 생성
            const nowTodo = todoData.filter((item) => item.id !== id);
            setSkip(0);
            setTodoData(nowTodo);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // 로컬에 저장한다 (DB 예정)
      // localStorage.setItem("todoData", JSON.stringify(nowTodo));
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
      uid: user.uid, // 여러명의 사용자 구분용도
    };

    // todoData : []
    // axios MongoDB

    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          // 검색어 초기화
          setTodoValue("");
          // 목로 재호출
          setSkip(0);
          getList("", 0);
          alert("할일이 등록되었습니다");
        } else {
          alert("할일 등록 실패하였습니다");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // setTodoData([...todoData, addTodo]);
    // 로컬에 저장한다.(DB 예정)
    // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));
    // setTodoValue("");
  };

  const deleteAllClick = () => {
    if (window.confirm("정말 모두 삭제하시겠습니까?")) {
      axios
        .post("/api/post/deleteall")
        .then(() => {
          setTodoData([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // 자료를 지운다.(DB 초기화)
    // localStorage.clear();
  };

  // 로딩창 관련
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex justify-center w-full">
      <div className="w-full p-6 m-4 bg-white rounded shadow">
        <div className="flex justify-between mb-3">
          <h1> {user.nickName}의 할일 목록 </h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>

        <div className="flex justify-between mb-3">
          <DropdownButton title={sort} variant="outline-secondary">
            <Dropdown.Item onClick={() => setSort("최신순")}>
              최신순
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("과거순")}>
              과거순
            </Dropdown.Item>
          </DropdownButton>
          <div className="search">
            <label className="mr-2"> 검색어 </label>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="border-2"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                }
              }}
            />
          </div>
        </div>
        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />

        {skipToggle && (
          <div className="flex justify-center m-2">
            <button
              className="text-black border-2 border-blue-400 rounded hover:text-black hover:bg-blue-400"
              onClick={() => geListMore()}
            >
              더보기
            </button>
          </div>
        )}

        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Todo;
