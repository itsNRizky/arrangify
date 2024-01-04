import { Tasks } from "@/lib/db/services";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

export default function Modal() {
  const [isShown, setIsShown, target, valueTarget] = useModalStore((state) => [
    state.isShown,
    state.setIsShown,
    state.target,
    state.valueTarget,
  ]);

  const targetModal = (target: TargetModal) => {
    switch (target) {
      case "addSection": {
        return <AddSection valueTarget={valueTarget} setIsShown={setIsShown} />;
      }
      case "addCard": {
        return <AddCard valueTarget={valueTarget} setIsShown={setIsShown} />;
      }
      case "deleteCard": {
        return <DeleteCard valueTarget={valueTarget} setIsShown={setIsShown} />;
      }
      case "deleteSection": {
        return (
          <DeleteSection valueTarget={valueTarget} setIsShown={setIsShown} />
        );
      }
    }
  };

  return (
    <>
      <Transition appear show={isShown} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsShown}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="modal-box">{targetModal(target)}</div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const DeleteCard = ({
  setIsShown,
  valueTarget,
}: {
  setIsShown: () => void;
  valueTarget: any;
}) => {
  const [board, updateBoard] = useBoardStore((state) => [
    state.board,
    state.updateBoard,
  ]);
  const deleteCardHandler = () => {
    Tasks.deleteTask(valueTarget);
    const newBoard = board.map((section) => {
      return {
        ...section,
        tasks: section.tasks.filter((task) => task.$id !== valueTarget),
      };
    });
    updateBoard(newBoard);
    setIsShown();
  };
  return (
    <>
      <h3 className="text-lg font-bold">Delete Card</h3>
      <p className="py-4">Are you sure deleting this card?</p>
      <div className="modal-action">
        <button className="btn" onClick={setIsShown}>
          Close
        </button>
        <button className="btn btn-error" onClick={deleteCardHandler}>
          Delete
        </button>
      </div>
    </>
  );
};

const DeleteSection = ({
  setIsShown,
  valueTarget,
}: {
  setIsShown: () => void;
  valueTarget: any;
}) => {
  return (
    <>
      <h3 className="text-lg font-bold">Delete Section</h3>
      <p className="py-4">Are you sure deleting this section?</p>
      <div className="modal-action">
        <button className="btn" onClick={setIsShown}>
          Close
        </button>
      </div>
    </>
  );
};

const AddCard = ({
  setIsShown,
  valueTarget,
}: {
  setIsShown: () => void;
  valueTarget: any;
}) => {
  const [board, updateBoard] = useBoardStore((state) => [
    state.board,
    state.updateBoard,
  ]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Task = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      dueDate: formData.get("dueDate") as string,
      // image: formData.get("image") as string,
      sectionId: formData.get("sectionId") as string,
      $id: "",
      $createdAt: "",
    };
    const newTaskId = await Tasks.createTask(data);
    const newBoard = board.map((section) => {
      if (section.sectionId === data.sectionId) {
        return {
          ...section,
          tasks: [
            ...section.tasks,
            {
              title: data.title,
              description: data.description,
              dueDate: data.dueDate,
              // image: data.image,
              sectionId: data.sectionId,
              $id: newTaskId,
              $createdAt: "",
            },
          ],
        };
      }
      return section;
    });
    updateBoard(newBoard);
    setIsShown();
  };
  return (
    <>
      <h3 className="text-lg font-bold">Add Card</h3>
      <form onSubmit={submitHandler}>
        <input type="hidden" name="sectionId" value={valueTarget} />
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Title <span className="text-error">*</span>
            </span>
          </label>
          <input
            required
            name="title"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            name="description"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Due Date</span>
          </label>
          <input
            type="date"
            name="dueDate"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <p className="py-4 text-left">
          <span className="text-error">*</span> Required
        </p>
        <div className="modal-action">
          <button className="btn" onClick={setIsShown}>
            Close
          </button>
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </div>
      </form>
    </>
  );
};

const AddSection = ({
  setIsShown,
  valueTarget,
}: {
  setIsShown: () => void;
  valueTarget: any;
}) => {
  return (
    <>
      <h3 className="text-lg font-bold">Add Section</h3>
      <p className="py-4">Press ESC key or click the button below to close</p>
      <div className="modal-action">
        <button className="btn" onClick={setIsShown}>
          Close
        </button>
      </div>
    </>
  );
};
