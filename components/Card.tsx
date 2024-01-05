import { Draggable } from "@hello-pangea/dnd";
import { FaX } from "react-icons/fa6";
import { LuGripVertical } from "react-icons/lu";
import React from "react";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  task: {
    $id: string;
    title: string;
    description?: string;
    dueDate?: string;
    image?: string;
    sectionId: string;
  };
  index: number;
};

const Card = (props: Props) => {
  const [_, setIsShown, setTarget, setValueTarget] = useModalStore((state) => [
    state.isShown,
    state.setIsShown,
    state.setTarget,
    state.setValueTarget,
  ]);
  const { task, index } = props;
  return (
    <>
      <Draggable key={task.$id} draggableId={task.$id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`card card-normal m-3 flex flex-row shadow`}
          >
            <div className="collapse m-auto rounded-r-none bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">
                <h3>{task.title}</h3>
              </div>
              <div className="collapse-content">
                <p>{task.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-r-xl bg-base-200 pr-3">
              <button
                onClick={() => {
                  setIsShown();
                  setTarget("deleteCard");
                  setValueTarget(task.$id);
                }}
                className="btn btn-circle btn-sm flex items-center justify-center bg-error text-base-100 hover:text-error"
              >
                <FaX className="h-3 w-3" />
              </button>
              <LuGripVertical className="text-primary-content" />
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Card;
