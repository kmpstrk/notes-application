interface TextInputProps {
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    autoComplete? :string;
    onChange? : (any:any)=> void;

  }
  
  const TextInput: React.FC<TextInputProps> = ({ label, placeholder, id, name, onChange, autoComplete }) => {

    return (
        <>
        <label htmlFor={id}>{label}</label>
        <input 
            type="text" 
            id = {id} 
            name = {name} 
            className="form-control shadow-hover"
            placeholder= {placeholder}
            onChange = {onChange}
            autoComplete = {autoComplete}
            ></input>
        </>
    );
  };
  
  export default TextInput;