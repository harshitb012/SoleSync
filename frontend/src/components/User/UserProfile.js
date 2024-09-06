import React, { useEffect } from 'react';
import MetaData from '../MetaData';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.css'
import defaultAvatar from '../../assets/Profile.png'; 

const UserProfile = () => {
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !isAuthenticated){
            navigate("/login")
        }
   
    }, [isAuthenticated, loading,navigate]);

    if (loading) {
        return <Loader />;
    }

    if (user) {
        const avatarUrl = user.profilepic && user.profilepic.url ? user.profilepic.url : defaultAvatar;

        console.log('User data:', user);

        return (
            <>  
                <MetaData title={`${user.name}'s Profile`} />
             
                <div className="profileContainer">
                    <div>
                        <h1>My Profile</h1>
                        <img src={avatarUrl} alt={user.name} />
                        <Link to="/me/update">Edit Profile</Link>
                    </div>
                    <div>
                        <div>
                            <h4>Full Name</h4>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <h4>Joined On</h4>
                            <p>{String(user.createdAt).substr(0, 10)}</p>
                        </div>
                        <div>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                            <Link to="/Home">Shop</Link>
                            {user.role === 'admin' && (
                <Link to="/admin/dashboard">Dashboard</Link>
              )}
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <Loader/>
                <div className="profileContainer">
                    <h1>No User Data Available</h1>
                </div>
            </>
        );
    }
};

export default UserProfile;