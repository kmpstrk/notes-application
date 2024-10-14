import { useState } from "react";



interface PasswordInputProps {
    id: string;
    name: string;
    label: string;
    placeholder? : string;
    autocomplete? : string;
    onChange? : (any:any)=> void;
  }
  
  const PasswordInput: React.FC<PasswordInputProps> = ({ id, name, label, placeholder, onChange, autocomplete }) => {
    const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    return (
      <div className="form-group mb-3">
        <label htmlFor= {id} className="form-label">
          {label}
        </label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            id={id}
            name={name}
            className="form-control shadow-hover"
            placeholder={placeholder}
            onChange = {onChange}
            autoComplete = {autocomplete}
          />
          <span
            className="input-group-text"
            onClick={togglePasswordVisibility}
            style={{ cursor: 'pointer' }}
          >
            <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'}></i>
          </span>
        </div>
      </div>
    );
  };
  
  export default PasswordInput;