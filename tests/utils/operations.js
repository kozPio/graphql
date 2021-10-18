import {gql} from 'apollo-boost';

const createUser = gql`
mutation($data: CreateUserInput!){
  createUser(
      data: $data
  ){
    token,
    user {
      id
      name
      email
    }
  }
}
`


const login = gql`
    mutation($data:LoginUserInput!) {
      login (
        data: $data
      ) {
        token
      }
    }
  `




  

  const getProfile = gql`
    query {
      user {
        id
        name
        email
      }
    }
  `


  const getUsers = gql`
    query {
      users {
        id
        name
      }
    }
    `




    const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published
      }
    }
  `



  const myPosts = gql`
    query {
      myPosts {
        id
        title
        body
        published
      }
    }
  `



  const updatePost = gql`
      mutation($id: ID!, $data: UpdatePostInput!) {
        updatePost(
          id: $id,
          data: $data
        ){
          id
          title
          body
          published
        }
      }
    `



    const createPost = gql`
    mutation($data: CreatePostInput!) {
      createPost(
        data: $data
      ){
        id
        title
        body
        published
      }
    }
  `


  const deletPost = gql`
    mutation($id: ID!) {
      deletePost(
        id: $id
      ) {
        id
      }
    }
  `


  const deleteComment = gql`
    mutation($id: ID!){
      deleteComment(id: $id){
        id
      }
    }
  `


  const subscribeToComments = gql`
    subscription($postId: ID!){
      comment(postId: $postId){
        mutation
        node {
          id
          text
        }
      }
    }
  `


  const subscribeToPosts = gql`
    subscription {
      post {
        mutation
      }
    }
  `

  export {createUser,login, getProfile, getUsers, getPosts, myPosts, updatePost, createPost, deletPost, deleteComment, subscribeToComments, subscribeToPosts}