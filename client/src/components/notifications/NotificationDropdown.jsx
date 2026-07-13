import React from "react";
import { FiCheck, FiBell } from "react-icons/fi";

const NotificationDropdown = ({ notifications, onRead, onMarkAllRead }) => {
  return (
    <div
      className="
      absolute right-0 mt-3
      w-96
      rounded-xl
      border border-line
      bg-white
      dark:bg-ink-light
      shadow-card
      overflow-hidden
      z-50
      "
    >
      {/* Header */}
      <div
        className="
        flex items-center justify-between
        border-b border-line
        dark:border-white/10
        px-4 py-3
        "
      >
        <div className="flex items-center gap-2">
          <FiBell className="text-accent" />

          <h3 className="font-semibold">Notifications</h3>
        </div>

        <button
          onClick={onMarkAllRead}
          className="
          text-xs
          text-accent
          hover:underline
          "
        >
          Mark all read
        </button>
      </div>

      {/* List */}

      <div
        className="
        max-h-96
        overflow-y-auto
        "
      >
        {notifications.length === 0 ? (
          <div
            className="
              p-8
              text-center
              text-muted
              "
          >
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              onClick={() => onRead(notification._id)}
              className={`
                w-full
                text-left
                px-4 py-3
                border-b
                border-line
                dark:border-white/10
                hover:bg-black/5
                dark:hover:bg-white/5

                ${!notification.isRead ? "bg-accent/5" : ""}

                `}
            >
              <div
                className="
                  flex justify-between
                  "
              >
                <p
                  className="
                    font-medium
                    text-sm
                    "
                >
                  {notification.title}
                </p>

                {!notification.isRead && (
                  <span
                    className="
                        h-2 w-2
                        rounded-full
                        bg-accent
                        "
                  />
                )}
              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted
                  "
              >
                {notification.message}
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-muted
                  "
              >
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
