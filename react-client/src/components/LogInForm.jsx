import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  updateUserInfo = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  loginFormClick = () => {
    this.props.handleLogin(this.state.username, this.state.password, this.props.showMsg);
    this.setState({ username: '', password: '' });
  }

  signupFormClick = () => {
    this.props.handleSignup(this.state.username, this.state.password, this.props.showMsg);
    this.setState({ username: '', password: '' });
  }

  render() {
    return (
      <form className="form" >
        <a className="username">Username: <input value={this.state.username} type="text" name="username" onChange={(e) => this.updateUserInfo(e)} /> </a>
        <a className="password">Password: <input value={this.state.password} type="password" name="password" onChange={(e) => this.updateUserInfo(e)} /> </a> <br />
        <br />
        <input type="button" value="Login" onClick={() => { this.loginFormClick(); }} />  <input type="button" value="Sign Up" onClick={() => { this.signupFormClick(); }} />
        <div className="err">{this.props.errorMsg}</div>
      </form >
    );
  }
}

export default LoginForm;