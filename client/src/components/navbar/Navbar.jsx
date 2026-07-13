// import React, { useState } from 'react';
// import { FiMenu, FiSun, FiMoon, FiBell, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
// import { useAuth } from '../../context/AuthContext';
// import { useTheme } from '../../context/ThemeContext';
// import { useNavigate } from 'react-router-dom';

// const Navbar = ({ onMenuClick }) => {
//   const { user, logout } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const initials = user?.name
//     ?.split(' ')
//     .map((p) => p[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase();

//   return (
//     <header className="glass-panel sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line px-4 dark:border-white/10 sm:px-6">
//       <div className="flex items-center gap-3">
//         <button onClick={onMenuClick} className="focus-ring rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10 lg:hidden">
//           <FiMenu className="h-5 w-5" />
//         </button>
//         <div className="hidden sm:block">
//           <p className="text-xs text-muted">
//             {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 sm:gap-3">
//         <button onClick={toggleTheme} className="focus-ring rounded-lg p-2.5 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Toggle theme">
//           {theme === 'dark' ? <FiSun className="h-[18px] w-[18px]" /> : <FiMoon className="h-[18px] w-[18px]" />}
//         </button>
//         <button className="focus-ring relative rounded-lg p-2.5 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Notifications">
//           <FiBell className="h-[18px] w-[18px]" />
//           <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
//         </button>

//         <div className="relative">
//           <button
//             onClick={() => setMenuOpen((v) => !v)}
//             className="focus-ring flex items-center gap-2 rounded-xl border border-line py-1.5 pl-1.5 pr-2.5 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
//           >
//             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-white">
//               {initials || 'U'}
//             </span>
//             <span className="hidden text-left sm:block">
//               <span className="block text-sm font-medium leading-tight">{user?.name}</span>
//               <span className="block text-[11px] leading-tight text-muted">{user?.role}</span>
//             </span>
//             <FiChevronDown className="h-4 w-4 text-muted" />
//           </button>

//           {menuOpen && (
//             <>
//               <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
//               <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-card dark:border-white/10 dark:bg-ink-light">
//                 <button
//                   onClick={() => {
//                     setMenuOpen(false);
//                     navigate('/profile');
//                   }}
//                   className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
//                 >
//                   <FiUser className="h-4 w-4" /> Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     setMenuOpen(false);
//                     logout();
//                     navigate('/login');
//                   }}
//                   className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
//                 >
//                   <FiLogOut className="h-4 w-4" /> Sign out
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

import NotificationDropdown from "../notifications/NotificationDropdown";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const initials = user?.name
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Fetch Notifications

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();

      console.log("Notification API:", res);
    console.log("Notification Data:", res.data);


      setNotifications(res.data || []);
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      loadNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      loadNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header
      className="
      glass-panel
      sticky
      top-0
      z-20
      flex
      h-16
      items-center
      justify-between
      border-b
      border-line
      px-4
      dark:border-white/10
      sm:px-6
    "
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="
          focus-ring
          rounded-lg
          p-2
          hover:bg-black/5
          dark:hover:bg-white/10
          lg:hidden
          "
        >
          <FiMenu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs text-muted">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme */}

        <button
          onClick={toggleTheme}
          className="
          focus-ring
          rounded-lg
          p-2.5
          hover:bg-black/5
          dark:hover:bg-white/10
          "
        >
          {theme === "dark" ? (
            <FiSun className="h-[18px] w-[18px]" />
          ) : (
            <FiMoon className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Notification */}

        <div className="relative">
          <button
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="
            focus-ring
            relative
            rounded-lg
            p-2.5
            hover:bg-black/5
            dark:hover:bg-white/10
            "
          >
            <FiBell className="h-[18px] w-[18px]" />

            {unreadCount > 0 && (
              <span
                className="
                absolute
                -right-1
                -top-1
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-accent
                text-[10px]
                font-bold
                text-white
                "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <NotificationDropdown
              notifications={notifications}
              onRead={handleRead}
              onMarkAllRead={handleMarkAllRead}
            />
          )}
        </div>

        {/* Profile Menu */}

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="
            focus-ring
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-line
            py-1.5
            pl-1.5
            pr-2.5
            hover:bg-black/5
            dark:border-white/10
            dark:hover:bg-white/10
            "
          >
            <span
              className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-accent
              text-xs
              font-semibold
              text-white
              "
            >
              {initials || "U"}
            </span>

            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight">
                {user?.name}
              </span>

              <span className="block text-[11px] leading-tight text-muted">
                {user?.role}
              </span>
            </span>

            <FiChevronDown className="h-4 w-4 text-muted" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              <div
                className="
                absolute
                right-0
                z-20
                mt-2
                w-48
                overflow-hidden
                rounded-xl
                border
                border-line
                bg-white
                py-1.5
                shadow-card
                dark:border-white/10
                dark:bg-ink-light
                "
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="
                  flex
                  w-full
                  items-center
                  gap-2.5
                  px-4
                  py-2.5
                  text-sm
                  hover:bg-black/5
                  dark:hover:bg-white/10
                  "
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="
                  flex
                  w-full
                  items-center
                  gap-2.5
                  px-4
                  py-2.5
                  text-sm
                  text-red-600
                  hover:bg-red-50
                  dark:hover:bg-red-500/10
                  "
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
