import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { Link, useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FaceIcon from '@material-ui/icons/Face';
import './UpdateProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstant';
import MetaData from '../MetaData';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const { error, isUpdated } = useSelector((state) => state.profile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('/Profile.png');

  useEffect(() => {
   
  
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    
      if (user.avatar) {
        setAvatarPreview(user.avatar.url || '/Profile.png');
      } else {
        setAvatarPreview('/Profile.png');
      }
    }
  
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  
    if (isUpdated) {
      alert.success('Profile Updated Successfully');
      dispatch(loadUser());
      navigate('/account');
  
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, alert, user, isUpdated, navigate, isAuthenticated]);
  const handleUpdateProfileSubmit = (e) => {
   
  


    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
  
    if (avatar) {
      formData.append('avatar', avatar);
    }
  
    console.log('FormData:', formData);
    dispatch(updateProfile(formData));
  };
  

  const handleUpdateProfileDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setAvatar(e.target.files[0]);
    };
    reader.readAsDataURL(e.target.files[0]);
  };


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        isAuthenticated ? (
          <>
            <MetaData title="Update Profile" />
            <div className="UpdateProfileContainer">
              <div className="UpdateProfileBox">
                <h2>Update Profile</h2>

                <form
                  className="updateProfileForm"
                  encType="multipart/form-data"
                  onSubmit={handleUpdateProfileSubmit}
                >
                  <div className="updateProfileName">
                    <FaceIcon />
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="updateProfileEmail">
                    <MailOutlineIcon />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div id="updateProfileImage">
                    <img src={avatarPreview} alt="avatar" />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleUpdateProfileDataChange}
                    />
                  </div>
                  <input
                    type="submit"
                    value="Update Profile"
                    className="updateProfileBtn"
                  />
                </form>
              </div>
            </div>
          </>
        ) : (
          <p>You are not authorized to access this page. Please login first.</p>
        )
      )}
    </>
  );
};

export default UpdateProfile;