import $ from 'jquery';

const loginService = (username, password, errorCb) => {
  $.ajax({
    url: '/users/login',
    method: 'POST',
    data: {
      username: username,
      password: password
    }
  })
    .then(res => {
      window.location = res;
    })
    .catch(err => {
      errorCb();
    });
};

export default loginService;