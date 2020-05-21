import React, { useState, useContext } from "react";

// GQL
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

// Semantic UI
import { Form, Button, Grid, Card, Header, Divider } from "semantic-ui-react";

// Hooks
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/Auth";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUser, {
    username: "",
    password: "",
  });

  const [addUser, { loading }] = useMutation(LOGIN_USER, {
    // This will be exiquted once mutation successfull run
    update(_, result) {
      console.log(result.data.login);
      context.login(result.data.login);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    // Pass values
    variables: values,
  });

  // Submit Form
  function loginUser() {
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
                Login
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
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  error={errors.password ? true : false}
                  onChange={onChange}
                />

                <Button type="submit" primary>
                  Login
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

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password }) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Login;
