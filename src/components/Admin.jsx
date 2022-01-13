import { auth } from '../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Crud from './Crud'


const Admin = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        if(auth.currentUser) {
            setUser(auth.currentUser)
        } else {
            navigate("/login")
        }
    }, [])

    return (
        <div>
            <h2>Admin</h2>
            <hr />
            <hr />
            {
                user && (
                    <Crud user={user} />
                )
            }
        </div>
    )
}

export default Admin
