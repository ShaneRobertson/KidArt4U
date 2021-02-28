

import React, { useState, useEffect } from "react";
import { getUsers } from "../api";
import UserCards from "./UserCards";
import PageHeader from "./PageHeader";

export default function DisplayAllUsers({ setToken, setRole, token, role }) {
  const [users, setUsers] = useState([]);

  // do not need local storage here
  // auth is handled once user signs in
  // once admin logs in; keys to the castle
  useEffect(() => {
    getUsers()
      .then((response) => {
        setUsers(response.allUsers);
      })
      .catch((error) => {
        setUsers(error.message);
      });
  }, []);


  return (
    <>
      <div className="userCardSection" style={{ paddingBottom: "16rem" }}>
        <UserCards users={users} setUsers={setUsers} />
      </div>
    </>
  );
}
