import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('Red098!@#$')
  },
  user: null,
  jwt: null
}


const seedDatabase = async()=> {
  //Delete test data
  await prisma.mutation.deleteManyPosts()
  await prisma.mutation.deleteManyUsers()

  //Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  })

  userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET)

  await prisma.mutation.createPost({
    data: {
      title: "My published post",
      body: '',
      published: true,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })

  await prisma.mutation.createPost({
    data: {
      title: "My Draft post",
      body: '',
      published: false,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  })
}

export { seedDatabase as default, userOne}