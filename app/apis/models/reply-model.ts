import { UserModel } from "./user-model"

export interface ReplyModel {
  _id: string
  property: string
  user: UserModel
  text: string
  parentComment: string
  createdAt: string
  updatedAt: string
  replies: ReplyModel[]
  isOwnerReply: boolean
  isOwnerComment: boolean
  isCurrentUser: boolean
}
