import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, LockIcon, SmsIcon } from "../../assets/Icons";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../store/reducers/authReducer";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setuser }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [email, set_email] = useState("");
  // const [allow_login, set_allow_login] = useState(true);

  const [password, set_password] = useState("");
  let allow_login = true;

  async function Handlelogin(event) {
    event.preventDefault(); // prevent the form from submitting
    if (allow_login == false) {
      return;
    }

    allow_login = false;
    try {
      const userData = await Axios.post(
        "https://api.davinci.bz/login",
        { email: email, password: password }
      ).then((response) => {
          localStorage.setItem("userAddress", response.data.data.userAddress);
          localStorage.setItem("userData", JSON.stringify(response.data.data));
          setuser();
          
          dispatch(setUserToken(true));
          navigate("dashboard/home");
      }).catch((error) => {
        if (error.response && error.response.status === 400) {
          toast("Username or password invalid.");
        } else {
          toast("An error occurred. Please try again.");
        }
        allow_login = true;
      });
    } catch (e) {
      allow_login = true;
      toast("An error occurred. Please try again.");
    }
  }

  const [passwordShow, setPasswordShow] = useState(false);
  return (
    <div className="login-page  bg-themeColor relative">
      <div className="shade absolute"></div>
      <div className="login_block flex">
        <div className="login-left flex-1">
          <div className="bg-left"></div>
        </div>
        <form
          className="login-right form-block flex flex-col flex-1 z-10"
          onSubmit={Handlelogin}
        >
          <div className="page-header flex flex-col gap-6 justify-center items-center">
            <img src="./images/logo.svg" className="p-logo" />
            <h1 className="title">Login</h1>
          </div>
          <div className="row1 w-full">
            <div className="input-field flex flex-col gap-3">
              <h1 className="input-lbl">Email</h1>
              <div className="input-box flex items-center gap-3">
                <div className="Icon">
                  <SmsIcon />
                </div>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="txt cleanbtn w-full"
                  value={email}
                  required
                  onChange={(e) => {
                    set_email(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="input-field flex flex-col gap-3">
              <h1 className="input-lbl">Password</h1>
              <div className="input-box flex items-center gap-3">
                <div className="Icon">
                  <LockIcon />
                </div>
                <input
                  type={passwordShow ? "text" : "password"}
                  placeholder="Enter Password"
                  className="txt cleanbtn w-full"
                  value={password}
                  required
                  onChange={(e) => {
                    set_password(e.target.value);
                  }}
                />
                <div
                  className="Icon"
                  onClick={(e) => setPasswordShow(!passwordShow)}
                >
                  <EyeIcon />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="forgot cursor-pointer">Forgot Password?</p>

                <Link to="/auth/register" className="forgot cursor-pointer">
                  Sign Up
                </Link>
              </div>
            </div>

            <button className="btn-register button">Login</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
