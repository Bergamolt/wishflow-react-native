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
  email?: string
  status: FeatureStatus
  votes: number
  locale: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type Vote = {
  featureId: string
  userId: string
  appId: string
  createdAt: number
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
  locale: string
  userInfo?: {
    userId?: string
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
  status: FeatureStatus | 'ALL'
  features: Feature[]
  loading: boolean
  onVote: (featureId: string) => Promise<void>
}

export type FeatureItemProps = {
  feature: Feature
  onVote: (featureId: string) => void
}

export type AddFeatureModalProps = {
  isVisible: boolean
  onClose: () => void
  onSubmit: (feature: Omit<Feature, 'id' | 'status' | 'votes' | 'createdAt' | 'updatedAt'>) => void
}

export type VoteButtonProps = {
  isVoted: boolean
  votes: number
  onPress: () => void
}
