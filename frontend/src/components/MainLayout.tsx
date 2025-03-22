import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div>
      <LeftSideBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
