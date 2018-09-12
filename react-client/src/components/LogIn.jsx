import React from 'react';

const Login = (props) => {
  return (
    <form className="form">
      <a className="username">Username: <input type="text" name="username" onChange={props.updateInfo} /> </a>
      <a className="password">Password: <input type="password" name="password" onChange={props.updateInfo} /> </a> <br />
      <br />
      <input type="button" value="Login" onClick={props.handleLogin} /> <input type="button" value="Sign Up" onClick={props.handleLogin}/>
      {props.error ? <div className="err">{props.errMsg}</div> : ('')}
    </form>
  );
};

export default Login;