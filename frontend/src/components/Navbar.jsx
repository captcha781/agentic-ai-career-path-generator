import { Avatar, Popover } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { firstName = "", lastName = "" } =
    useSelector((state) => state.auth) || {};
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  const [anchorEl, setAnchorEl] = useState(null);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignout = () => {
    navigate("/signout");
  };

  return (
    <nav className="bg-sky-100 shadow-md px-7 py-4 flex justify-between items-center border-b border-sky-200">
      <h1 className="text-2xl font-extrabold tracking-tight text-sky-600 drop-shadow">
        CareerGen
      </h1>
      <div>
        <Avatar
          onClick={handleAvatarClick}
          sx={{
            bgcolor: "#fff",
            color: "#38bdf8",
            fontWeight: 700,
            cursor: "pointer",
            width: 40,
            height: 40,
            border: "2px solid #bae6fd",
            boxShadow: "0 2px 8px 0 #bae6fd44",
            fontSize: 14,
          }}
        >
          {initials || "U"}
        </Avatar>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 128,
              boxShadow: "0 4px 16px 0 #bae6fd88",
              background: "#fff",
              p: 0.5,
              border: "1px solid #bae6fd",
            },
          }}
        >
          <div
            onClick={() => {
              handleSignout();
              handleClose();
            }}
            className="text-sm text-sky-700 px-4 py-2 cursor-pointer hover:bg-sky-50 transition rounded font-semibold"
          >
            Sign Out
          </div>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
