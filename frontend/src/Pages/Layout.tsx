import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div>
      {/* Nabar foes here */}
      <Outlet />
      {/* Footer goes here */}
    </div>
  );
};

export default Layout;
