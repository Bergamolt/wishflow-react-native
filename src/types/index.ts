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

export type WishFlowConfig = {
  secretKey: string
  appId: string
  locale?: string
  userId?: string
  styles?: DefaultStyles
  customComponents?: {
    VoteButton: {
      customIcon?: React.ReactNode
    }
  }
}

export type WishFlowContainerProps = {
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
  }
}

export type FeatureTabProps = {
  type: 'approved' | 'implemented'
  features: Feature[]
  loading?: boolean
  onVote: (featureId: string) => void
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
  votes: number
  onPress: () => void
}
