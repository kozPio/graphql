import prisma from "../prisma"
import getUserId from "../utils/getUserId"

const User = {
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {request}, info){
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })
    }
  },
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {request}, info){
      const userId = getUserId(request)
  
      if( userId && userId === parent.id){
        return parent.email
      }else{
        return null
      }
  
      
    }
  }
}


export {User as default}