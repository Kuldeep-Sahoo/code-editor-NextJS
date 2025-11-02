"use client";

import React from "react";
import { SignedOut } from "@clerk/clerk-react";
import { UserButton } from "@clerk/nextjs";
import { User, Code2, Boxes } from "lucide-react";
import LoginButtom from "./LoginButtom";

const HeaderProfileBtn = () => {
  return (
    <>
      {/* When signed in */}
      <UserButton afterSignOutUrl="/">
        <UserButton.MenuItems>
          <UserButton.Link
            label="👤 Profile"
            labelIcon={<User className="size-4" />}
            href="/profile"
          />
          <UserButton.Link
            label="🧠 Practice"
            labelIcon={<Code2 className="size-4" />}
            href="/practice"
          />
          <UserButton.Link
            label="📘 Snippets"
            labelIcon={<Boxes className="size-4" />}
            href="/snippets"
          />
        </UserButton.MenuItems>
      </UserButton>

      {/* When signed out */}
      <SignedOut>
        <LoginButtom />
      </SignedOut>
    </>
  );
};

export default HeaderProfileBtn;
