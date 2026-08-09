export interface HomeScreenProps {
  onSelectMoment: (momentId: number) => void
  readMoments: Set<number>
}
