import React, { useState, useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import EditUser from './EditUser'
import MyAccountOrders from './MyAcctOrders'
// import PageHeader from './PageHeader'

import { getOrder } from '../api'



const UserPage = ({ userInfo, setUserInfo, isAdmin }) => {
    // console.log("userInfo in UserPage", userInfo)
    const [orders, setOrders] = useState()
    // console.log("isAdmin: ", isAdmin)

    useEffect(() => {
        getOrder()
            .then((response) => {
                console.log("response from getOrder for user: ", response)
                setOrders(response.order)
            })
            .catch((error) => {
                setOrders(error.message)
            })
    }, [])

    // console.log("orders in myacctorders: ", orders)

    const panes = [

        {
            menuItem: 'My Info',
            render: () => <Tab.Pane /*attached={false}*/>{<EditUser userInfo={userInfo} setUserInfo={setUserInfo} />}</Tab.Pane>,
        },
        {
            menuItem: 'My Orders',
            render: () => <Tab.Pane /*attached={false}*/>{<MyAccountOrders orders={orders} />}</Tab.Pane>,
        },

    ]

    const panes2 = [

        {
            menuItem: 'My Info',
            render: () => <Tab.Pane /*attached={false}*/>{<EditUser userInfo={userInfo} setUserInfo={setUserInfo} />}</Tab.Pane>,
        }

    ]
    return (
        <>
            {isAdmin ? <Tab className="myAccount" /*menu={{ secondary: true }}*/ panes={panes2} /> : <Tab className="myAccount" /*menu={{ secondary: true }}*/ panes={panes} />}


        </>
    )
}

export default UserPage