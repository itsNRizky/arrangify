import React from "react";
import AddSectionButton from "./AddSectionButton";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="navbar md:mb-5">
      <h1 className="navbar-start text-2xl font-bold">Arrangify</h1>
      <nav className="navbar-end">
        <ul className="flex items-center gap-3">
          {true ? (
            <>
              <li>
                <AddSectionButton />
              </li>
              <li>
                <button className="avatar placeholder btn btn-circle">
                  <div className="w-10 rounded-full bg-primary text-neutral-content">
                    <span className="text-xl">D</span>
                  </div>
                </button>
              </li>
            </>
          ) : (
            <li>
              <button className="btn btn-primary" type="button">
                Login
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
