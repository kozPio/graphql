import 'cross-fetch/polyfill';
import {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, {userOne} from './utils/seedDatabase';
import getClient from './utils/getClient';


const client = getClient();


beforeEach(seedDatabase, 15000)

test('Should create new user', async ()=>{
  const createUser = gql`
    mutation{
      createUser(
          data: {
            name: "Piotr",
            email: "'piotr@examle.com",
            password: "MyPass123"
          }
      ){
        token,
        user {
          id
        }
      }
    }
  `

  const response = await client.mutate({
    mutation: createUser
  })


  const exists = await prisma.exists.User({ id: response.data.createUser.user.id})

  expect(exists).toBe(true)
  
})

test('Should exspose public authors profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
      }
    }
  `


  const response = await client.query({ query: getUsers});

  expect(response.data.users.length).toBe(1)


  expect(response.data.users[0].name).toBe('Jen')
})




test('Should not login with bad credentials', async () => {
  const login = gql`
    mutation {
      login (
        data: {
          email: "jen@example.com",
          password: "Red8!@#$"
        }
      ) {
        token
      }
    }
  `


  await expect(client.mutate({ mutation: login})
  ).rejects.toThrow()

})


test('Should not signup user with invalid password', async ()=> {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "piotr",
          email: "pio@example.com",
          password: "pass"
        }
      ){
        token
      }
    }
  `
  await expect(client.mutate({ mutation: createUser})
  ).rejects.toThrow()


})


test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt)

  const getProfile = gql`
    query {
      user {
        id
        name
        email
      }
    }
  `


  const {data} = await client.query({ query: getProfile})

  expect(data.user.id).toBe(userOne.user.id);
  expect(data.user.name).toBe(userOne.user.name);
  expect(data.user.email).toBe(userOne.user.email);
})