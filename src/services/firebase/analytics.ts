import { getAnalytics, logEvent } from 'firebase/analytics'
import app from '.'

const analytics = getAnalytics(app)

// track the user time in the page /chat/[chatID]
export const chat_opened = (chatID: string) => {
  logEvent(analytics, 'chat_opened', {
    chatID
  })
}
export const chat_closed = (chatID: string) => {
  logEvent(analytics, 'chat_closed', {
    chatID
  })
}

export default analytics
