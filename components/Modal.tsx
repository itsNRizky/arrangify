import { Sections, Tasks } from "@/lib/db/services";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Colorful from "@uiw/react-color-colorful";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert";

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
      case "editSection": {
        return (
          <EditSection valueTarget={valueTarget} setIsShown={setIsShown} />
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
  const [board, updateBoard] = useBoardStore((state) => [
    state.board,
    state.updateBoard,
  ]);

  const deleteSectionHandler = async () => {
    await Sections.deleteSection(valueTarget);
    const newBoard: BoardData = board.filter(
      (section) => section.sectionId !== valueTarget,
    );
    updateBoard(newBoard);
    setIsShown();
  };
  return (
    <>
      <h3 className="text-lg font-bold">Delete Section</h3>
      <p className="py-4">Are you sure deleting this section?</p>
      <div className="modal-action">
        <button className="btn" onClick={setIsShown}>
          Close
        </button>
        <button className="btn btn-error" onClick={deleteSectionHandler}>
          Delete
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
  const [board, updateBoard] = useBoardStore((state) => [
    state.board,
    state.updateBoard,
  ]);

  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Section = {
      name: formData.get("name") as string,
      $id: "",
      user: valueTarget as string,
      color: hsvaToHex(hsva),
    };
    const id = await Sections.createSection(data);

    const newBoard: BoardData = [
      ...board,
      {
        sectionId: id,
        sectionName: data.name,
        tasks: [],
        sectionColor: data.color,
      },
    ];
    updateBoard(newBoard);
    setIsShown();
  };
  return (
    <>
      <h3 className="text-lg font-bold">Add Section</h3>
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
            name="name"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Label Color <span className="text-error">*</span>
            </span>
          </label>
          <Colorful
            style={{ width: "100%" }}
            color={hsva}
            disableAlpha
            onChange={(color) => {
              setHsva(color.hsva);
            }}
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

const EditSection = ({
  setIsShown,
  valueTarget,
}: {
  setIsShown: () => void;
  valueTarget: Column;
}) => {
  const [board, updateBoard] = useBoardStore((state) => [
    state.board,
    state.updateBoard,
  ]);

  const [name, setName] = useState(valueTarget.sectionName);
  const [hsva, setHsva] = useState(hexToHsva(valueTarget.sectionColor));

  const submitHandler = async () => {
    const data: Section = {
      name: name,
      $id: "",
      user: "",
      color: hsvaToHex(hsva),
    };
    await Sections.updateSection(valueTarget.sectionId, data);

    const newBoard = board.map((section) => {
      if (section.sectionId === valueTarget.sectionId) {
        return { ...section, sectionName: data.name, sectionColor: data.color };
      } else {
        return section;
      }
    });
    updateBoard(newBoard);
    setIsShown();
  };
  return (
    <>
      <h3 className="text-lg font-bold">Edit Section</h3>
      <form>
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Title <span className="text-error">*</span>
            </span>
          </label>
          <input
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Label Color <span className="text-error">*</span>
            </span>
          </label>
          <Colorful
            style={{ width: "100%" }}
            color={hsva}
            disableAlpha
            onChange={(color) => {
              setHsva(color.hsva);
            }}
          />
        </div>
        <p className="py-4 text-left">
          <span className="text-error">*</span> Required
        </p>
      </form>
      <div className="modal-action">
        <button className="btn" onClick={setIsShown}>
          Close
        </button>
        <button
          type="submit"
          className="btn btn-success"
          onClick={submitHandler}
        >
          Edit
        </button>
      </div>
    </>
  );
};
