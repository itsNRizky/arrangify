"use client";

import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useBoardStore } from "@/store/BoardStore";
import Column from "./Column";
import { swapCard, swapColumns } from "@/lib/utils/swapper";
import { useModalStore } from "@/store/ModalStore";
import Modal from "./Modal";
import { Tasks } from "@/lib/db/services";
import Skeleton from "./Skeleton";

type Props = {};

const Board = (props: Props) => {
  const [board, getBoardByUserId, updateBoard, moveTaskToSection] =
    useBoardStore((state) => [
      state.board,
      state.getBoardByUserId,
      state.updateBoard,
      state.moveTaskToSection,
    ]);

  const [isShown] = useModalStore((state) => [state.isShown]);

  useEffect(() => {
    getBoardByUserId("657009ce8fc195402f7c");
  }, [getBoardByUserId]);

  const onDragEndHandler = async (results: DropResult) => {
    const { source, destination, draggableId, type } = results;

    // If nothing changed
    if (!destination) return;

    // If column or card dragged but not dropped in diffrent place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Create logic for controlling column
    if (type === "column") {
      const newBoard = swapColumns(board, source.index, destination.index);

      updateBoard(newBoard);
    }

    if (type === "card" && source.droppableId === destination.droppableId) {
      const newBoard: any = swapCard(
        board,
        { sourceDropableId: source.droppableId },
        { sourceIndex: source.index, destinationIndex: destination.index },
      );
      updateBoard(newBoard);
    }

    // Logic for controlling card in another section
    if (type === "card" && source.droppableId !== destination.droppableId) {
      const newBoard: any = swapCard(
        board,
        {
          sourceDropableId: source.droppableId,
          destinationDropableId: destination.droppableId,
        },
        { sourceIndex: source.index, destinationIndex: destination.index },
      );
      updateBoard(newBoard);
      Tasks.moveTaskToSection(draggableId, destination.droppableId);
    }
  };
  return (
    <>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className=" flex max-w-7xl flex-col gap-5 p-2 sm:flex-row"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {board.length === 0 && (
                <div className="grid w-screen grid-cols-1 gap-5 sm:grid-cols-3">
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </div>
              )}
              {board.map((column, index) => (
                <Column index={index} key={column.sectionId} column={column} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal />
    </>
  );
};

export default Board;
