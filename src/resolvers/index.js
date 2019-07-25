/*jshint esversion: 6 */
import userResolvers from './user';
import messageResolvers from './message';
//aggregate and export both resolvers for both Objects
export default [userResolvers, messageResolvers];
