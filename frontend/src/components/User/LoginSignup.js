import React, { useRef, useState, useEffect } from 'react';
import Loader from '../Loader/Loader';
import { Link, useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';
import './LoginSignup.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login ,register} from '../../actions/userAction';
import { useAlert } from 'react-alert';

const LoginSignup = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, loading, isAuthenticated } = useSelector(state => state.user);

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const { name, email, password } = user;
    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
        if (isAuthenticated) { 
            navigate("/account")
          }
       
    };

    const registerSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.append("avatar", avatar);
        dispatch(register(myForm))
        .then(() => {
          // Handle successful registration
          alert.success("Registration successful! Please login.");
          navigate("/login");
        })
        .catch((error) => {
          // Handle registration error
          alert.error(error.response.data.message);
        });
    };

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
      
  
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated) {
            navigate("/login");
        }
    }, [dispatch, error, alert, isAuthenticated, navigate]);
    
    useEffect(()=>{
    if (switcherTab.current) {
        switcherTab.current.classList.add("shiftToLeft");
        registerTab.current.classList.remove("shiftToNeutralForm");
        loginTab.current.classList.remove("shiftToRight");
      }
    }, [switcherTab, registerTab, loginTab]);

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");
            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");
            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
            loginTab.current.classList.add("stayInBox"); 
        }
    };

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <div className="LoginSignupContainer">
                        <div className="LoginSignupBox">
                            <div>
                                <div className="login_signUp_toggle">
                                    <p onClick={(e) => switchTabs(e, "login")}>Login</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>Register</p>
                                </div>
                                <button ref={switcherTab} className="toggle-button"></button>
                            </div>
                            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                                <div className="loginEmail">
                                    <MailOutlineIcon />
                                    <input type="email" id="logmail" placeholder="Email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                </div>
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input type="password" id="logpass" placeholder="Password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                                </div>
                                <Link to="/password/forgot">Forgot Password?</Link>
                                <input type="submit" value="Login" className="loginBtn" />
                            </form>
                            <form className="signUpForm" ref={registerTab} encType="multipart/form-data" onSubmit={registerSubmit}>
                                <div className="signUpName">
                                    <FaceIcon />
                                    <input type="text" placeholder="Name" required name="name" value={name} onChange={registerDataChange} />
                                </div>
                                <div className="signUpEmail">
                                    <MailOutlineIcon />
                                    <input type="email" placeholder="Email" required name="email" value={email} onChange={registerDataChange} />
                                </div>
                                <div className="signUpPassword">
                                    <LockOpenIcon />
                                    <input type="password" placeholder="Password" required name="password" value={password} onChange={registerDataChange} />
                                </div>
                                <div id="registerImage">
                                    <img src={avatarPreview} alt="avatar" />
                                    <input type="file" name="avatar" accept="image/*" onChange={registerDataChange} />
                                </div>
                                <input type="submit" value="Register" className="signUpBtn" />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default LoginSignup;
