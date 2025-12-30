import { gql, TypedDocumentNode } from '@apollo/client';

type GetUsersQuery = {
  getUsers: {
    id: string;
    name: string;
    age: number;
    isMarried: boolean;
  }[];
};

type GetUserByIdQuery = {
  getUserById: {
    id: string;
    name: string;
    age: number;
    isMarried: boolean;
  };
};

type CreateUserMutation = {
  createUser: {
    id: string;
    name: string;
    age: number;
    isMarried: boolean;
  };
};

type GetUsersQueryVariables = Record<string, unknown>;
type GetUserByIdQueryVariables = { id: string };
type CreateUserMutationVariables = {
  name: string;
  age: number;
  isMarried: boolean;
};

export const GET_USERS: TypedDocumentNode<
  GetUsersQuery,
  GetUsersQueryVariables
> = gql`
  query GetUsers {
    getUsers {
      id
      name
      age
      isMarried
    }
  }
`;

export const GET_USER_BY_ID: TypedDocumentNode<
  GetUserByIdQuery,
  GetUserByIdQueryVariables
> = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      age
      isMarried
    }
  }
`;

export const CREATE_USER: TypedDocumentNode<
  CreateUserMutation,
  CreateUserMutationVariables
> = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      id
      name
      age
      isMarried
    }
  }
`;
