import React from "react";

type Props = {};

const Skeleton = (props: Props) => {
  return (
    <div
      className={`card skeleton flex flex-col justify-between rounded-md bg-base-100 shadow-md`}
    >
      <div>
        <h2 className="card-title skeleton rounded-t-md p-6 text-primary-content"></h2>
        <div className="card skeleton card-normal m-3">
          <div className="collapse skeleton m-auto rounded-r-none bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium"></div>
            <div className="collapse-content"></div>
          </div>
        </div>
      </div>
      <button className="btn skeleton btn-sm m-3 bg-base-300"></button>
    </div>
  );
};

export default Skeleton;
