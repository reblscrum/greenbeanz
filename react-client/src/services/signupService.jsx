import $ from 'jquery';

const signupService = (username, password, cb) => {
  $.ajax({
    url: '/users/signup',
    method: 'POST',
    data: {
      username: username,
      password: password
    }
  })
    .then(res => {
      cb(res);
    })
    .catch(err => {
      cb(err);
    });
};

export default signupService;