import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

// Semantic UI
import { Card, Form, Button, Header } from "semantic-ui-react";

// Custome Form
import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";

function PostForm() {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      console.log(result);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Card fluid>
      <Card.Content>
        <Header
          as="h4"
          style={{
            margin: "0px 0px 15px 0px",
            textAlign: "center",
            display: "block !important",
            width: "100%",
          }}
        >
          Create Post
        </Header>
        <Form onSubmit={onSubmit} noValidate>
          <Form.Field>
            <Form.Input
              placeholder="Hi World!"
              name="body"
              onChange={onChange}
              value={values.body}
            />
          </Form.Field>
          <Button type="submit" primary>
            Post
          </Button>
        </Form>
      </Card.Content>
    </Card>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
      likeCount
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
