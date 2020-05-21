import React, { useContext } from "react";

// Sematic UI
import { Grid, Header, GridColumn } from "semantic-ui-react";

// GQL
import { useQuery } from "@apollo/react-hooks";

// Components
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

import { AuthContext } from "../context/Auth";
import { FETCH_POSTS_QUERY } from "../util/GraphQL";

function Home() {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const { user } = useContext(AuthContext);

  return (
    <Grid columns={3}>
      <Header
        as="h2"
        style={{
          margin: "15px 0px",
          textAlign: "center",
          display: "block !important",
          width: "100%",
        }}
      >
        Recent Posts
      </Header>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <p>Posts Loading...</p>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
              <PostCard posts={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
