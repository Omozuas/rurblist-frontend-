import { ReplyModel } from "./reply-model"
import { UserModel } from "./user-model"

type ParentCommentReference = string | null | { _id?: string }

export interface CommentModel {
  _id: string
  property: string
  user: UserModel
  text: string
  parentComment: ParentCommentReference
  createdAt: string
  updatedAt: string
  replies: ReplyModel[]
  isOwnerComment: boolean
  isCurrentUser: boolean
}
