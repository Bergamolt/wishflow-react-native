import { DefaultStyles } from '../config'

export enum FeatureStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export type Feature = {
  id: string
  title: string
  description: string
  status: FeatureStatus
  votesCount: number
  createdAt: number
  updatedAt: number
  appId: string
  userId: string
  locale: string
}

export type Vote = {
  featureId: string
  userId: string
  appId: string
  createdAt: number
}

export type UserInfo = {
  userId: string
  email?: string
  locale?: string
}

export type FeatureFormData = {
  title: string
  description: string
}

export type Theme = {
  background: string
  text: string
  primary: string
  secondary: string
  success: string
  error: string
  warning: string
  card: string
  border: string
  shadow: string
  overlay: string
}

export type WishFlowConfig = {
  secretKey: string
  appId: string
  userInfo?: {
    userId?: string
    email?: string
    locale?: string
  }
  styles: Required<DefaultStyles>
  statusColors: {
    [key in FeatureStatus]: string
  }
  theme: Theme
  components?: {
    VoteButton?: {
      customIcon?: React.ReactNode
    }
  }
}

export type SetWishFlowConfig = {
  secretKey: string
  appId: string
  locale?: string
  userInfo?: {
    userId?: string
  }
  styles?: DefaultStyles
  statusColors?: {
    [key in FeatureStatus]: string
  }
  theme?: Partial<Theme>
  components?: {
    VoteButton?: {
      customIcon?: React.ReactNode
    }
  }
}

export type FeatureListProps = {
  features: Feature[]
  votes: Vote[]
  status: FeatureStatus | 'ALL'
  loading: boolean
  onVote: (featureId: string) => Promise<void>
}

export type FeatureItemProps = {
  feature: Feature
  votes: Vote[]
  onVote: (featureId: string) => void
}

export type AddFeatureModalProps = {
  isVisible: boolean
  onClose: () => void
  onSubmit: (feature: FeatureFormData, userInfo: UserInfo) => void
}

export type VoteButtonProps = {
  isVoted: boolean
  votes: number
  onPress: () => void
}
