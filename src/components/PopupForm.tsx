import React, { useMemo, useState } from "react";
import "../assets/styles/PopupForm.css"; // Import styles for the modal
import { User } from "../types/user";

interface PopupFormProps {
  onClose: () => void; // Function to close the modal
  onAddUser: (user: User) => void; // Function to handle form submission
  data: User;
  clearData: () => void;
}

export const PopupForm: React.FC<PopupFormProps> = ({
  onClose,
  onAddUser,
  data,
  clearData,
}) => {
  const [userName, setUserName] = useState<string>(data.userName || "");
  const [userEmail, setUserEmail] = useState<string>(data.userEmail || "");
  const [userPassword, setUserPassword] = useState<string>(
    data.userPassword || ""
  );

  const [permissions, setPermissions] = useState<Array<number>>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user: User = {
      userName,
      userEmail,
      userPassword,
    };
    onAddUser(user);
    setUserName("");
    setPermissions([]);
    // onClose(); // Close the popup after form submission
  };

  const classList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePermissionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setPermissions(selectedValues);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userid">UserId:</label>
            <input
              type="text"
              id="userid"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Add User
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
