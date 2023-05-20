import { CourseRegistrations } from "@prisma/client";
import { withFilter } from "graphql-subscriptions";
import {
  type CourseInputType,
  type UserInputType,
} from "../interfaces/sharedTypes";
import { Context } from "./context";

const subscribeToFreeSeats = {
  subscribe: withFilter(
    (_parent, args: { courseId: string }, context) =>
      context.pubsub.asyncIterator(`${args?.courseId}_free_seats`),
    (_payload, _variables, _context) => {
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
    getAllUsers: (
      parent: unknown,
      args: unknown,
      context: Context,
      _info: unknown
    ) => {
      return context.prisma.user.findMany({ orderBy: { reg_no: "asc" } });
    },
    getUserByID: (
      parent: unknown,
      args: { id: string },
      context: Context,
      _info: unknown
    ) => context.prisma.user.findUnique({ where: { reg_no: args?.id } }),

    getCourses: (
      parent: unknown,
      args: unknown,
      context: Context,
      _info: unknown
    ) =>
      context.prisma.courseDetails.findMany({
        orderBy: { course_code: "asc" },
      }),

    getCourseByID: (
      parent: unknown,
      args: { id: string },
      context: Context,
      _info: unknown
    ) => {
      return context.prisma.courseDetails.findUnique({
        where: { course_code: args?.id },
      });
    },
    getCourseRegistrations: (
      _parent: unknown,
      _args: unknown,
      context: Context,
      _info: unknown
    ) => {
      let courseReg = context.prisma.courseRegistrations.findMany({});
      return courseReg;
    },
    getCourseRegistrationByCourseId: (
      _parent: unknown,
      args: { courseId: string },
      context: Context,
      _info: unknown
    ) => {
      let courseReg = context.prisma.courseRegistrations.findMany({
        where: {
          mapped_course_code: args?.courseId,
        },
      });
      return courseReg;
    },
    getFreeSeats: async (
      _parent: unknown,
      args: { courseId: string },
      context: Context,
      _info: unknown
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
      parent: unknown,
      args: { data: UserInputType },
      context: Context,
      _info: unknown
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
      parent: unknown,
      args: { data: CourseInputType },
      context: Context,
      _info: unknown
    ) => {
      return context.prisma.courseDetails.create({
        data: {
          course_code: args?.data.course_code,
          name: args?.data.name,
        },
      });
    },
    createRegistration: async (
      parent: unknown,
      args: { data: { reg_no: string; course_code: string } },
      context: Context,
      _info: unknown
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
