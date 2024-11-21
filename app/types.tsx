interface Wish {
    name: string,
    link: string,
    comment: string
}

interface User {
    username: string,
    displayName: string,
    password: string,
    wishes: Wish[],
    giving: string,
    sessionID: string
  }

export type {Wish, User}