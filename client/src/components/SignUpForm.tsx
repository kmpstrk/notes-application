import Button from "./Button";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import Loading from "./Loading";
import Alert from "./Alert";



const SIGNUP = gql`
    mutation Signup($username:String! $password:String!) {
        signup (username: $username password:$password){
            user{
                id
                username
            }
        }
    }`;

    

const SignupForm: React.FC = () => {
    const [signupMutation, {loading}] = useMutation(SIGNUP);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confimationOfPassw, setConfimationOfPassw] = useState<string>('');
    const [errorLogin, setErrorSignup] = useState<string>('');
    const [errorFromBack, setErrorFromBack] = useState<string>('');
    const navigate = useNavigate();



    useEffect(() => {
      if (username || password) {
          setErrorFromBack('');
      }
    }, [username, password]);


    const validateForm = ()=>{
        if(!username || !password){
            setErrorSignup('All inputs are required');
            return false;
        }
        if(username.length > 20){
            setErrorSignup('Username is too long');
            return false;
        }
        if(password.length < 8){
            setErrorSignup('Password must be 8 symbols or more');
            return false;
        }
        if(password !== confimationOfPassw){
            setErrorSignup('Password values are not the same');
            return false;
        }
        return true;
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()){
            try{
                setUsername(DOMPurify.sanitize(username));
                setPassword(DOMPurify.sanitize(password));
                const { data } = await signupMutation({ variables: {username:username, password:password} });
                localStorage.setItem('token', data.signup.token);
                navigate('/');
            } catch(err){
              setErrorFromBack('Oops, this username already exists');
              console.error(err);
            }
            
        }
    };


  return (
    <div className="form-container container pt-4 col-12 col-md-5 mt-5 shadow p-4 rounded bg-white">
      <h2 className="text-center mb-4">Sign Up</h2>
      <form>
        <div className="form-group mb-4">
          <TextInput
            id="username"
            name="username"
            placeholder="Enter your username..."  
            label="Username"
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password..."
            label="Password"
            autocomplete="new-password" 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <PasswordInput
            id="conf-password"
            name="conf-password"
            placeholder="Enter your password..."
            label="Confirm your password"
            autocomplete="new-password" 
            onChange={(e) => setConfimationOfPassw(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/login" className="text-muted">
           <p>Have an account? Log in</p> 
          </Link>
          <Button className="btn btn-primary" text="Sign up" type="submit" onClick={e => handleSignup(e)}/>
        </div>
      </form>

      {loading ? <Loading /> : errorFromBack && errorFromBack !== '' && <Alert text={errorFromBack} color="danger" />}

      {errorLogin && <Alert text={errorLogin} color="danger"/>}

    </div>
  );
};

export default SignupForm;
