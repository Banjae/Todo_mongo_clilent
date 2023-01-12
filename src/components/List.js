import React from "react";
import { useSelector } from "react-redux";
import ListItem from "./ListItem";

const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  const user = useSelector((state) => state.user);
  // console.log("List Rendering");
  return (
    <>
      {todoData.map(
        (item) =>
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </>
  );
});

export default List;
