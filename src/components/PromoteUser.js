import React from "react";
import { updateRole } from "../api";
import { Dropdown } from "semantic-ui-react";

export default function PromoteUser({ id, role, setUsers }) {

  return (
    <>
      {role === "admin" ? (
        <>
          <Dropdown text="Update" style={{ marginRight: "2.5rem" }}>
            <Dropdown.Menu>
              <Dropdown.Item
                text="USER"
                onClick={async () => {
                  const updatedUserList = await updateRole(id, role);
                  setUsers(updatedUserList);
                }}
              />
            </Dropdown.Menu>
          </Dropdown>{" "}
          <span>Current status: {role.toUpperCase()}</span>
        </>
      ) : (
        <>
          <Dropdown text="Update" style={{ marginRight: "2.5rem" }}>
            <Dropdown.Menu>
              <Dropdown.Item
                text="ADMIN"
                onClick={async () => {
                  const updatedUserList = await updateRole(id, role);
                  setUsers(updatedUserList);
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
          <span>Current status: {role.toUpperCase()}</span>
        </>
      )}
    </>
  );
}
