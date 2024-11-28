import React, { useEffect, useState } from "react";
import { DashboardContainer } from "../containers/DashboardContainer";
import "../assets/styles/Users.css"; // Importing custom styles
import { Button } from "../components/Button";
import { PopupForm } from "../components/PopupForm";
import "../assets/styles/Button.css";
import { createUser, deleteUser, list } from "../service/UserService";
import { User } from "../types/user";
import { useAuth } from "../context/AuthContext";

export const Users: React.FC<any> = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>("");
  const [users, setUsers] = useState<Array<User>>([]);
  const [isChange, setChange] = useState(false);

  const { schoolCode, schoolName } = useAuth();

  useEffect(() => {
    async function getData() {
      const data = await list();
      console.log(data);
      setUsers(data);
      console.log(data);
    }
    getData();
    setChange(false);
  }, [isChange]);

  useEffect(() => {
    console.log("popup", showPopup);
  }, [showPopup]);

  const handleAddUser = async (user: User) => {
    //api call
    console.log("user", user);
    const newUser: User = {
      ...user,
      userType: "User",
    };
    const response = await createUser(newUser as any);
    if (response) {
      setChange(true);
      setShowPopup(!showPopup);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setEditData("");
  };

  const handleDelete = async (id: string) => {
    setChange(false);
    const response = await deleteUser(id);
    if (response) {
      alert(response);
      setChange(true);
    }
  };

  return (
    <DashboardContainer>
      {showPopup && (
        <PopupForm
          onClose={handleClose}
          onAddUser={handleAddUser}
          data={editData as any}
          clearData={() => setEditData("")}
        />
      )}
      {editData && (
        <PopupForm
          onClose={handleClose}
          onAddUser={handleAddUser}
          data={editData as User}
          clearData={() => setEditData("")}
        />
      )}
      <h1>Users List</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>User ID</th>
              <th>Last login time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 &&
              users.map((user) => (
                <tr key={user.userEmail}>
                  <td>{user.userName}</td>
                  <td>{user.userEmail}</td>
                  <td>
                    {user?.lastLoginTime
                      ? new Date(user.lastLoginTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {/* <button className="edit-btn" onClick={() => setEditData(user)}>Edit</button> */}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user._id as string)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <button className="button" onClick={() => setShowPopup(!showPopup)}>
          Add User
        </button>
      </div>
    </DashboardContainer>
  );
};
