import React from "react";
import AddSectionButton from "./AddSectionButton";
import { UserButton } from "@clerk/nextjs";

type Props = {
  userId: string;
};

const Header = async (props: Props) => {
  return (
    <header className="navbar">
      <h1 className="navbar-start text-2xl font-bold">Arrangify</h1>
      <nav className="navbar-end">
        <ul className="flex items-center gap-3">
          {true ? (
            <>
              <li>
                <AddSectionButton userId={props.userId} />
              </li>
              <li>
                <UserButton afterSignOutUrl="/signin" />
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
