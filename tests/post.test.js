import 'cross-fetch/polyfill';
import seedDatabase, {userOne, postOne, postTwo} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';
import { getPosts, myPosts, updatePost, createPost, deletPost } from './utils/operations';

const client = getClient();



beforeEach(seedDatabase, 15000)

test('Should expose published posts', async ()=> {
  

  const response = await client.query({ query: getPosts});

  expect(response.data.posts.length).toBe(1);

  expect(response.data.posts[0].published).toBe(true)
})


test('Should fetch users posts', async () => {
  const client = getClient(userOne.jwt)
  

  const {data} = await client.query({ query: myPosts});

  expect(data.myPosts.length).toBe(2);


});

test('Shoul be able to update own post', async ()=> {
    const client = getClient(userOne.jwt)
    const variables = {
      id: postOne.post.id,
      data: {
        published: false
      }
    }

    const {data} = await client.mutate({mutation: updatePost, variables});

    const exists =await prisma.exists.Post({id: postOne.post.id, published: false})

    expect(data.updatePost.published).toBe(false);
    expect(exists).toBe(true)


});
test('should create a new post', async ()=> {
  const client = getClient(userOne.jwt)
  
  const variables = {
    data: {
      title: "A test post",
      body: "",
      published: true
    }
  }

    const {data} =  await client.mutate({mutation: createPost, variables});

    expect(data.createPost.title).toBe("A test post");
    expect(data.createPost.body).toBe("");
    expect(data.createPost.published).toBe(true);


});


test('Should delete post', async ()=> {
  const client = getClient(userOne.jwt)
  const variables = {
    id: postTwo.post.id
  }


  await client.mutate({ mutation: deletPost, variables});
  const exists = await  prisma.exists.Post({id: postTwo.post.id});
  

  expect(exists).toBe(false)

})