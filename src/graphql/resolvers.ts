import { Context } from "./context";
import { withFilter } from "graphql-subscriptions";
import {
  type UserInputType,
  type CourseInputType,
} from "../interfaces/sharedTypes";
import { CourseRegistrations, User } from "@prisma/client";

const subscribeToFreeSeats = {
  subscribe: withFilter(
    (_parent, args: { courseId: string }, context) =>
      context.pubsub.asyncIterator(`${args?.courseId}_free_seats`),
    (payload, _variables, context) => {
      return true;
    }
  ),
  resolve: (payload: { data: number }) => {
    return payload.data;
  },
};

export const resolvers = {
  Query: {
    viewer: () => "Hello World!",
    getAllUsers: (parent: any, args: any, context: Context, _info: any) => {
      return context.prisma.user.findMany({ orderBy: { reg_no: "asc" } });
    },
    getUserByID: (parent: any, args: any, context: Context, _info: any) =>
      context.prisma.user.findUnique({ where: { reg_no: args?.id } }),

    getCourses: (parent: any, args: any, context: Context, _info: any) =>
      context.prisma.courseDetails.findMany({
        orderBy: { course_code: "asc" },
      }),

    getCourseByID: (parent: any, args: any, context: Context, _info: any) => {
      return context.prisma.courseDetails.findUnique({
        where: { course_code: args?.id },
      });
    },
    getCourseRegistrations: (
      _parent: any,
      _args: any,
      context: Context,
      _info: any
    ) => {
      let courseReg = context.prisma.courseRegistrations.findMany({});
      return courseReg;
    },
    getCourseRegistrationByCourseId: (
      _parent: any,
      args: { courseId: string },
      context: Context,
      _info: any
    ) => {
      let courseReg = context.prisma.courseRegistrations.findMany({
        where: {
          mapped_course_code: args?.courseId,
        },
      });
      return courseReg;
    },
    getFreeSeats: async (
      _parent: any,
      args: { courseId: string },
      context: Context,
      _info: any
    ) => {
      let courseReg: CourseRegistrations[] =
        await context.prisma.courseRegistrations.findMany({
          where: {
            mapped_course_code: args?.courseId,
          },
        });
      const freeSeats = 70 - courseReg.length;
      await context.pubsub.publish(`${args?.courseId}_free_seats`, {
        data: freeSeats,
      });
      return 70 - courseReg.length;
    },
  },
  Mutation: {
    createUser: (
      parent: any,
      args: { data: UserInputType },
      context: Context,
      _info: any
    ) => {
      let post = context.prisma.user.create({
        data: {
          reg_no: args?.data.reg_no,
          name: args?.data.name,
        },
      });

      return post;
    },
    createCourse: (
      parent: any,
      args: { data: CourseInputType },
      context: Context,
      _info: any
    ) => {
      return context.prisma.courseDetails.create({
        data: {
          course_code: args?.data.course_code,
          name: args?.data.name,
        },
      });
    },
    createRegistration: async (
      parent: any,
      args: { data: any },
      context: Context,
      _info: any
    ) => {
      let registration = context.prisma.courseRegistrations.create({
        data: {
          userReg_no: args?.data.reg_no,
          mapped_course_code: args?.data.course_code,
        },
      });

      let courseReg: CourseRegistrations[] =
        await context.prisma.courseRegistrations.findMany({
          where: {
            mapped_course_code: args?.data.course_code,
          },
        });
      const freeSeats = 70 - courseReg.length;
      await context.pubsub.publish(`${args?.data.course_code}_free_seats`, {
        data: freeSeats,
      });

      return registration;
    },
  },
  Subscription: {
    getFreeSeatsForCourse: subscribeToFreeSeats,
  },
};
