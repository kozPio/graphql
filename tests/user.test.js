import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, {userOne} from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getProfile, getUsers } from './utils/operations';


const client = getClient();


beforeEach(seedDatabase, 15000)



test('Should create new user', async ()=>{
  const variables = {
    data: {
      name: "Andrew",
      email: "andrew@example.com",
      password: "red12345"
    }
  }


  const response = await client.mutate({
    mutation: createUser,
    variables
  })


  const exists = await prisma.exists.User({ id: response.data.createUser.user.id})

  expect(exists).toBe(true)
  
})

test('Should exspose public authors profiles', async () => {


  const response = await client.query({ query: getUsers});

  expect(response.data.users.length).toBe(2)


  expect(response.data.users[0].name).toBe('Jen')
})




test('Should not login with bad credentials', async () => {

  const variables = {
    data: {
      email: "jen@example.com",
      password: "red098!@#$"
    }
  }




  await expect(client.mutate({ mutation: login, variables})
  ).rejects.toThrow()

})


test('Should not signup user with invalid password', async ()=> {

  const variables = {
    data: {
      name: "piotr",
      email: "pio@example.com",
      password: "pass"
    }
  }


  await expect(client.mutate({ mutation: createUser, variables})
  ).rejects.toThrow()


})


test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt)

  


  const {data} = await client.query({ query: getProfile})

  expect(data.user.id).toBe(userOne.user.id);
  expect(data.user.name).toBe(userOne.user.name);
  expect(data.user.email).toBe(userOne.user.email);
})