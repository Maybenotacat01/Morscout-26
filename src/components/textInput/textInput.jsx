import "./textInput.css"

const TextInput = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <div className='input-field'>
      <label htmlFor={name}>{label} :</label>
      <input
        autoComplete="off"
        className='text-input'
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;
