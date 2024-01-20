"use client";
import { useModalStore } from "@/store/ModalStore";
import React from "react";

type Props = {
  userId: string;
};

const AddSectionButton = (props: Props) => {
  const [setIsShown, setTarget, setValueTarget] = useModalStore((state) => [
    state.setIsShown,
    state.setTarget,
    state.setValueTarget,
  ]);
  return (
    <button
      onClick={() => {
        setIsShown();
        setTarget("addSection");
        setValueTarget(props.userId);
      }}
      className="btn btn-ghost"
    >
      Add Section
    </button>
  );
};

export default AddSectionButton;
