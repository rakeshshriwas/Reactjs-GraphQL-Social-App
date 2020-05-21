import React, { useState, useContext } from "react";

// GQL
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

// Semantic UI
import { Form, Button, Grid, Card, Header, Divider } from "semantic-ui-react";

// Hooks
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/Auth";

function Register(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { onChange, onSubmit, values } = useForm(registerUser, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // This will be exiquted once mutation successfull run
    update(_, result) {
      console.log(result);
      context.login(result.data.register);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    // Pass values
    variables: values,
  });

  function registerUser() {
    addUser();
  }

  return (
    <Grid columns="equal">
      <Grid.Row stretched>
        <Grid.Column width={6} style={{ margin: "20px auto" }}>
          <Card fluid>
            <Card.Content>
              <Header
                as="h2"
                style={{
                  margin: "0px 0px 15px 0px",
                  textAlign: "center",
                  display: "block !important",
                  width: "100%",
                }}
              >
                Register
              </Header>
              <Divider />
              <Form
                onSubmit={onSubmit}
                noValidate
                className={loading ? "loading" : ""}
              >
                <Form.Input
                  label="Username"
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={values.username}
                  error={errors.username ? true : false}
                  onChange={onChange}
                />
                <Form.Input
                  label="Email"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  error={errors.email ? true : false}
                  onChange={onChange}
                />
                <Form.Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  error={errors.password ? true : false}
                  onChange={onChange}
                />
                <Form.Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  error={errors.confirmPassword ? true : false}
                  value={values.confirmPassword}
                  onChange={onChange}
                />
                <Button type="submit" primary>
                  Register
                </Button>
              </Form>
              {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                  <ul className="list">
                    {Object.values(errors).map((value) => {
                      return <li key={value}>{value}</li>;
                    })}
                  </ul>
                </div>
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Register;
