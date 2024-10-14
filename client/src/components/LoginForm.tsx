import Button from "./Button";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import Loading from "./Loading";
import Alert from "./Alert";



const LOGIN = gql`
    mutation Login($username:String! $password:String!) {
        login (username: $username password:$password){
            token
            user{
            id
            username}
        }
    }`;

    

const LoginForm: React.FC = () => {
    const [loginMutation, {loading}] = useMutation(LOGIN);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorLogin, setErrorLogin] = useState<string>('');
    const [errorFromBack, setErrorFromBack] = useState<string>('');
    const navigate = useNavigate();


    useEffect(() => {
      if (username || password) {
          setErrorFromBack('');
      }
  }, [username, password]);


    const validateForm = ()=>{
        if(!username || !password){
            setErrorLogin('Both inputs are required');
            return false;
        }
        if(username.length > 20){
            setErrorLogin('Username is too long');
            return false;
        }
        if(password.length < 8){
            setErrorLogin('Password must be 8 symbols or more');
            return false;
        }
        return true;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()){
            try{
                setUsername(DOMPurify.sanitize(username));
                setPassword(DOMPurify.sanitize(password));
                const { data } = await loginMutation({ variables: {username : username, password : password} });
                localStorage.setItem('token', data.login.token);
                navigate('/');
            } catch(err){
              setErrorFromBack('Oops, wrong username or password. Try again');
              console.error(err);
            }
            
        }
    };


  return (
    <div className="form-container container pt-4 col-12 col-md-5 mt-5 shadow p-4 rounded bg-white">
      <h2 className="text-center mb-4">Login</h2>
      <form>
        <div className="form-group mb-4">
          <TextInput
            id="username"
            name="username"
            placeholder="Enter your username..."  
            label="Username"
            autoComplete="username"
            onChange={(e) =>{ 
              setErrorLogin(''); 
              setUsername(e.target.value)}}
          />
        </div>

        <div className="form-group mb-4">
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password..."
            label="Password"
            autocomplete="current-password" 
            onChange={(e) => {
              setErrorLogin(''); 
              setPassword(e.target.value)}}
          />
        </div>


        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/signup" className="text-muted">
            <p>Don't have an account? Sign up</p>
          </Link>
          <Button className="btn btn-primary" text="Log in" type="submit" onClick={e => handleLogin(e)}/>
        </div>
      </form>

      {loading ? <Loading /> : errorFromBack && errorFromBack !== '' && <Alert text={errorFromBack} color="danger" />}

      {errorLogin && <Alert text={errorLogin} color="danger"/>}

    </div>
  );
};

export default LoginForm;
