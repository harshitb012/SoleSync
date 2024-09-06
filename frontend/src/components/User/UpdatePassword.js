import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { Link, useNavigate } from 'react-router-dom';
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import './UpdatePassword.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updatePassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MetaData from '../MetaData';
const UpdatePassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
  
    const {  loading, isAuthenticated } = useSelector(state => state.user);
    const { error, isUpdated } = useSelector((state) => state.profile);
  
 const [oldPassword, setOldPassword] = useState("")
const [newPassword, setNewPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")
 
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
    
      if (isUpdated) {
        alert.success('Profile Updated Successfully');
       
        navigate('/account');
    
        dispatch({ type: UPDATE_PASSWORD_RESET });
      }
    }, [dispatch, error, alert,, isUpdated, navigate, isAuthenticated]);
    const handleupdatePasswordSubmit = (e) => {
   
  
  
      e.preventDefault();
      const formData = new FormData();
      formData.append('oldPassword', oldPassword);
      formData.append('newPassword', newPassword);
      formData.append('confirmPassword', confirmPassword);
      dispatch(updatePassword(formData));
    };
    
  
    

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        isAuthenticated ? (
          <>
            <MetaData title="Change Password" />
            <div className="updatePasswordContainer">
              <div className="updatePasswordBox">
                <h2>Update Password</h2>



                <form
                  className="updatePasswordForm"
                  encType="multipart/form-data"
                  onSubmit={handleupdatePasswordSubmit}
                >

                               <div className="loginPassword">
                                    <VpnKeyIcon />
                                    <input type="password" id="logpass" placeholder="Old Password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                </div>
                               <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input type="password" id="logpass" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                               <div className="loginPassword">
                                    <LockIcon />
                                    <input type="password" id="logpass" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>

                  <input
                    type="submit"
                    value="Change"
                    className="updatePasswordBtn"
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
}

export default UpdatePassword
