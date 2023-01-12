// 작은 store 역할의 slice
// 사용자 정보 저장 내용 userSlice
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    nickName: "",
    uid: "",
    accessToken: "", //firebase 임시 생성
    email: "",
  },
  reducers: {
    // 로그인되면 user 스토어 state 업데이트
    loginUser: (state, action) => {
      state.nickName = action.payload.displayName;
      state.uid = action.payload.uid;
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
    },
    // 로그아웃 하면 user 스토어 state 비우기
    clearUser: (state, action) => {
      state.nickName = "";
      state.uid = "";
      state.accessToken = "";
      state.email = "";
    },
  },
});

export const { loginUser, clearUser } = userSlice.actions;
export default userSlice;
