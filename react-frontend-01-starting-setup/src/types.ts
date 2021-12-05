/* eslint-disable no-unused-vars */
export type UserType = {
  id: string;
  name: string;
  image: string;
  places?: any[];
  placesCount?: number;
};

export type UsersType = {
  users: UserType[];
};
