export interface MomentScreenProps {
  momentId: number
  onBack: () => void
  onMarkRead: (momentId: number) => void
  onNavigate: (momentId: number) => void
}
