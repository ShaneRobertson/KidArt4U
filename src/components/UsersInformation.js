import React from "react";
import ConfirmDeleteUser from "./ConfirmDeleteUser";
import PromoteUser from './PromoteUser'
import { Table } from "semantic-ui-react";


export default function UsersInformation({
  id,
  username,
  email,
  role,  setUsers,
}) {

  //const role = JSON.parse(localStorage.getItem("user")).role;

  return (
    <Table.Row key={id}>
      <Table.Cell>{username}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>
        <PromoteUser id={id} role={role} setUsers={setUsers}/>
      </Table.Cell>
      <Table.Cell>
        <ConfirmDeleteUser id={id} username={username} setUsers={setUsers} />
      </Table.Cell>
    </Table.Row>
  );
}
