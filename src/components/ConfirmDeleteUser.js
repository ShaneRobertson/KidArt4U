import React, {useState} from 'react'
import {Button, Confirm} from 'semantic-ui-react'
import {checkOrdersAndCart, deleteUser, getUsers} from '../api'

export default function ConfirmDelete({id, username, setUsers}) {
   const [open, setOpen] = useState(false)

    const  show = () => setOpen( true )
//const handleConfirm = () => setOpen(false )
    const handleCancel = () => setOpen(false )


  return (
    <div>
      <Button onClick={show} color='red'>Delete</Button>
      <Confirm
        open={open}
        content={`Are you sure you want to delete ${username}?`}
        cancelButton='Never mind'
        confirmButton="Let's do it"
        onCancel={handleCancel}
        onConfirm={async () => {
          checkOrdersAndCart(id)
          await deleteUser(id) 
          const {allUsers} = await getUsers()
          setUsers(allUsers)
          setOpen(false)
        }}
      />
    </div>
      
    )
}
