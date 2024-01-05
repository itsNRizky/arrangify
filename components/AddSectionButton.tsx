"use client";
import { useModalStore } from "@/store/ModalStore";
import React from "react";

type Props = {};

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
        setValueTarget("657009ce8fc195402f7c");
      }}
      className="btn btn-ghost"
    >
      Add Section
    </button>
  );
};

export default AddSectionButton;
