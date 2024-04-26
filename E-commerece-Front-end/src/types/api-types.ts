import { User } from "./types"

export interface MessageResponse {
  success : boolean,
  message : string
}

export type UserResponse = {
   success : boolean,
   user : User
}