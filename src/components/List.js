import React from "react";
import ListItem from "./ListItem";

const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  // console.log("List Rendering");
  return (
    <>
      {todoData.map((item) => (
        <div key={item.id}>
          <ListItem
            item={item}
            todoData={todoData}
            setTodoData={setTodoData}
            deleteClick={deleteClick}
          />
        </div>
      ))}
    </>
  );
});

export default List;
