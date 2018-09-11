import React from 'react';

const Login = (props) => {
  return (
      <form className="form">
          <a className="username">Username: <input type="text" name="username" onChange={props.updateInfo}/> </a> 
          <a className="password">Password: <input type="password" name="password" onChange={props.updateInfo}/> </a> <br/>
          {props.error ? <div className="err">Sorry, there was an error logging in. Please try again.</div> : ('') }
          <br/>
          <input type="button" value="Login" onClick={props.handleLogin}/>
      </form>
  )
}

export default Login;