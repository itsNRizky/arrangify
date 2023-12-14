"use client";
import { useModalStore } from "@/store/ModalStore";
import React from "react";

type Props = {};

const AddSectionButton = (props: Props) => {
  const [_, setIsShown, setTarget] = useModalStore((state) => [
    state.isShown,
    state.setIsShown,
    state.setTarget,
  ]);
  return (
    <button
      onClick={() => {
        setIsShown();
        setTarget("addSection");
      }}
      className="btn btn-ghost"
    >
      Add Section
    </button>
  );
};

export default AddSectionButton;
