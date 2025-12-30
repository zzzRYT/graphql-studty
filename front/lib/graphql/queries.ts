import { gql, TypedDocumentNode } from '@apollo/client';

type GetUserQuery = {
  getUsers: {
    __typename: string;
    id: string;
    name: string;
    age: number;
    isMarried: boolean;
  }[];
  getUserById: {
    __typename: string;
    id: string;
    name: string;
    age: number;
    isMarried: boolean;
  };
};

type GetUserMutation = {
  createUser: {
    id: string;
    name: string;
    age: number;
    isMarried: boolean;
  };
};

type GetUserQueryVariables = Record<string, unknown>;
type CreateUserMutationVariables = Record<string, unknown>;

export const GET_USERS: TypedDocumentNode<
  GetUserQuery,
  GetUserQueryVariables
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
  GetUserQuery,
  GetUserQueryVariables
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
  GetUserMutation,
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
