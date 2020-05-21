module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be valid email address";
    }
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.password = "Password must be same";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  // Check username empty
  if (username.trim() === "") {
    errors.username = "username must be not empty";
  }
  // Check password empty
  if (password.trim() === "") {
    errors.password = "password must be not empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
