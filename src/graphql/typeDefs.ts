import { gql } from "apollo-server-core";

export const typeDefs = gql`
  input UserInputType {
    name: String!
    reg_no: String!
  }

  input CourseInputType {
    course_code: String!
    name: String!
  }

  input CourseRegistrationType {
    reg_no: String!
    course_code: String!
  }

  type User {
    name: String!
    reg_no: String!
  }

  type CourseRegistration {
    mapped_course_code: String!
    userReg_no: String
  }

  type Course {
    course_code: String!
    name: String!
  }

  type Query {
    viewer: String!
    getAllUsers: [User]
    getUserByID(id: Int!): User
    getCourses: [Course]
    getCourseByID(id: String!): Course
    getCourseRegistrations(data: String!): [CourseRegistration]
    getCourseRegistrationByCourseId(courseId: String!): [CourseRegistration]
    getFreeSeats(courseId: String!): Int
  }

  type Mutation {
    createUser(data: UserInputType!): User
    createCourse(data: CourseInputType!): Course
    createRegistration(data: CourseRegistrationType!): CourseRegistration
  }

  type Subscription {
    getFreeSeatsForCourse(courseId: String!): Int
  }
`;

// type Mutation {
//   createPost(data: PostCreateInput!): Post
// }

// type Post {
//   id: Int!
//   title: String!
// }

// input PostCreateInput {
//   content: String
//   title: String!
// }

// type Query {
//   posts: [Post]
// }

// type Subscription {
//   newPost: Post
// }
