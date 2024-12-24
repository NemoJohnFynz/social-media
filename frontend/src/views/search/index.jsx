import React from 'react'
import CardUserList from './userCard/cardUserList'
import { useEffect, useState } from 'react';
import user from '../../service/user';
import { useUser } from '../../service/UserContext';
export default function Searchpage() {
    const { userContext, setUserContext } = useUser();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchdata = async () => {
            const res = await user.getAllUser();
            if (res.success == true) {
                setUsers(res.data)
                console.log(res)
            } else {

            }
        }
        fetchdata()
    }, []);
    // console.log(users)
    return (
        <div className="flex justify-center pt-3 items-center w-full">
            <div className='px-4 py-3 shadow-md shadow-gray-300 w-full mt-5'>
                <strong className='text-lg'>Mọi người</strong>
                {
                    users.map((_, index) => (
                        userContext._id == _._id ? '' :
                            <CardUserList userdata={_} key={index} />
                    ))
                }
            </div>
        </div>
    )
}
