import React from "react";
import {  Table } from "semantic-ui-react";
import UserInformation from './UsersInformation'

export default function UserCards({ users, setUsers }) {

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Username</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Permissions</Table.HeaderCell>
          <Table.HeaderCell>Delete</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
          {users.map((user) =>{
               const {id, username, email, role} = user
               return (
                 <UserInformation key={id} id={id} username={username} email={email} role={role} setUsers={setUsers}/>
               )
          })}
       
      </Table.Body>
    </Table>
  );
}
