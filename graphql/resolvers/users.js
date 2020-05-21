const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validatores");

const User = require("../../models/User");

// Const

const { SECRET_KEY } = require("../../config");

// Genrate Token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    // Login User Mutation
    async login(_, { loginInput: { username, password } }) {
      /* Validate Login Data */
      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Check valid username
      const user = await User.findOne({ username });
      console.log(user);
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong Credentials";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user.id,
        token,
      };
    },

    // New User Mutation
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Destructure args here
      // Validation user data
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // Make sure user doesn't already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      // hash password and reate and auth token
      password = await bcrypt.hash(password, 12);

      // Create and set User Object
      const newUser = User({
        // Destructure email: email
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      // Save user
      const result = await newUser.save();

      const token = generateToken(result);
      return {
        ...result._doc,
        id: result.id,
        token,
      };
    },
  },
};
