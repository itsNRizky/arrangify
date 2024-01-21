import { Board } from "@/lib/db/services";
import { Tasks } from "@/lib/db/services";
import { create } from "zustand";

interface BoardState {
  board: BoardData;
  getBoardByUserId: ($userId: string) => void;
  updateBoard: (board: BoardData) => void;
  moveTaskToSection: ($id: string, sectionId: string) => void;
  // addColumn: (column: Column) => void;
  // updateColumn: (column: Column) => void;
  // deleteColumn: (columnId: string) => void;
  // addTask: (columnId: string, task: Task) => void;
  // updateTask: (columnId: string, task: Task) => void;
  // deleteTask: (columnId: string, taskId: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: [],
  getBoardByUserId: async ($userId) => {
    const board = await Board.getBoardByUser($userId);
    set({ board });
  },
  updateBoard: (board) => {
    set({ board });
  },

  moveTaskToSection: async ($id, sectionId) => {
    try {
      await Tasks.moveTaskToSection($id, sectionId);
    } catch (err) {
      console.log(err);
    }
  },
}));
