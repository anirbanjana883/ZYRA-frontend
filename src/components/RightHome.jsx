import React from "react";
import Messages from "../pages/Messages";

function RightHome() {
  return (
    <div className="w-[25%] hidden lg:block min-h-[100vh] bg-gradient-to-b from-black via-[#0a0f1f] to-[#01030a] border-l border-[#0c1b3b] fixed right-0 top-0">
      <Messages />
    </div>
  );
}

export default RightHome;
