import { create } from "zustand";

interface ModalState {
  isShown: boolean;
  setIsShown: () => void;
  target: TargetModal;
  setTarget: (target: TargetModal) => void;
  valueTarget?: any;
  setValueTarget: (target: any) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isShown: false,
  setIsShown: () => {
    set((state) => ({ isShown: !state.isShown }));
  },
  target: "",
  setTarget: (target) => {
    set((state) => ({ target }));
  },
  valueTarget: "",
  setValueTarget: (valueTarget) => {
    set((state) => ({ valueTarget }));
  },
}));
