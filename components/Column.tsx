import { Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";
import Card from "./Card";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  column: Column;
  index: number;
};

const Column = (props: Props) => {
  const [_, setIsShown, setTarget, setValueTarget] = useModalStore((state) => [
    state.isShown,
    state.setIsShown,
    state.setTarget,
    state.setValueTarget,
  ]);
  const { column, index } = props;
  return (
    <Draggable
      key={column.sectionId}
      draggableId={column.sectionId}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className=""
        >
          <Droppable
            key={column.sectionId}
            droppableId={column.sectionId}
            type="card"
          >
            {(provided) => (
              <div
                className={`card flex flex-col justify-between rounded-md bg-base-100 shadow-md`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div>
                  <h2 className="card-title rounded-t-md bg-blue-500 p-3 text-primary-content">
                    {column.sectionName}
                  </h2>
                  {column.tasks.map((task, index) => (
                    <Card key={task.$id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
                <button
                  onClick={() => {
                    setIsShown();
                    setTarget("addCard");
                    setValueTarget(column.sectionId);
                  }}
                  className="btn btn-sm m-3 bg-base-300"
                >
                  Add
                </button>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
