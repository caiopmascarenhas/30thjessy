import { useCallback, useEffect, useState } from 'react'

import { IntroConstellation } from '~/components/IntroConstellation'
import { MusicPlayer } from '~/components/MusicPlayer'
import { MOMENTS, BIRTHDAY_CONFIG } from '~/config'
import { useNow } from '~/hooks'
import { musicService } from '~/music'
import { navigateToHome, navigateToMoment, useHashRoute } from '~/navigation'
import { AccessScreen } from '~/screens/AccessScreen'
import { FinaleScreen } from '~/screens/FinaleScreen'
import { HomeScreen } from '~/screens/HomeScreen'
import { MomentScreen } from '~/screens/MomentScreen'
import {
  isMomentUnlocked,
  readNumberSet,
  readSessionFlag,
  writeNumberSet,
  writeSessionFlag,
} from '~/utils'

import { styles } from './App.styles'

const INTRO_SEEN_KEY = 'jessy:intro-seen'

const hasSeenIntro = () => {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

const markIntroSeen = () => {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch (error) {
    console.warn('[intro] Não foi possível registrar a abertura.', error)
  }
}

const App = () => {
  const [authenticated, setAuthenticated] = useState(() =>
    readSessionFlag(BIRTHDAY_CONFIG.authStorageKey),
  )
  const [showIntro, setShowIntro] = useState(() =>
    readSessionFlag(BIRTHDAY_CONFIG.authStorageKey) && !hasSeenIntro(),
  )
  const [readMoments, setReadMoments] = useState<Set<number>>(() =>
    readNumberSet(BIRTHDAY_CONFIG.readStorageKey),
  )
  const route = useHashRoute()
  const now = useNow()

  useEffect(() => {
    if (!authenticated) {
      return
    }

    void musicService.play().catch(() => undefined)
  }, [authenticated])

  const handleAuthenticated = useCallback(() => {
    writeSessionFlag(BIRTHDAY_CONFIG.authStorageKey, true)
    setAuthenticated(true)
    setShowIntro(!hasSeenIntro())
    navigateToHome()
    void musicService.play().catch(() => undefined)
  }, [])

  const handleIntroComplete = useCallback(() => {
    markIntroSeen()
    setShowIntro(false)
  }, [])

  const handleMarkRead = useCallback((momentId: number) => {
    setReadMoments((current) => {
      if (current.has(momentId)) {
        return current
      }

      const next = new Set(current)
      next.add(momentId)
      writeNumberSet(BIRTHDAY_CONFIG.readStorageKey, next)
      return next
    })
  }, [])

  if (!authenticated) {
    return (
      <div style={styles.App}>
        <AccessScreen onAuthenticated={handleAuthenticated} />
      </div>
    )
  }

  let screen = <HomeScreen onSelectMoment={navigateToMoment} readMoments={readMoments} />

  if (route.name === 'moment') {
    const moment = MOMENTS.find((item) => item.id === route.momentId)

    if (moment && isMomentUnlocked(moment, now)) {
      screen =
        moment.id === 30 ? (
          <FinaleScreen onBack={navigateToHome} onMarkRead={handleMarkRead} />
        ) : (
          <MomentScreen
            momentId={moment.id}
            onBack={navigateToHome}
            onMarkRead={handleMarkRead}
            onNavigate={navigateToMoment}
          />
        )
    }
  }

  return (
    <div style={styles.App}>
      {screen}
      <MusicPlayer />
      {showIntro ? <IntroConstellation onComplete={handleIntroComplete} /> : null}
    </div>
  )
}

export default App
