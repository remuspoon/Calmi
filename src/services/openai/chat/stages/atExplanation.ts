import { RESPONSE_TYPE } from '..'
import { chatCompletions } from '../..'
import { lastbotanduser, staticResponse, userAffirmed } from '../../helper'

const AT_EXPLANATION: RESPONSE_TYPE | RESPONSE_TYPE[] = [
  {
    response: async (messages) => {
      const res = staticResponse([
        "In CBT, Automatic thoughts are those quick, almost reflex-like thoughts that come to us without us really trying. They're like knee-jerk reactions, but in our minds. These thoughts aren't always true or helpful. Sometimes they're way off base or just too negative.",

        "For example, imagine you're walking down the street, and you see someone you know. You wave at them, but they don't wave back. Instantly, a thought pops into your head: 'Did I do something wrong? Why are they mad at me?' That immediate thought? That's what we call an 'automatic thought'.",

        "We want to try catch these sneaky thoughts, question them (like, 'Maybe that person didn't see me?'), and come up with better, more balanced thoughts. This way, instead of feeling hurt or worried, we might just think, 'Maybe they were distracted. I'll check in with them later.'",

        'Do you understand? Can we move on?'
      ])()
      return res
    },

    next: async (messages) => {
      const params = lastbotanduser(messages as any)
      const userAffirm = await userAffirmed(params)

      if (userAffirm) {
        return { token: 'atDistortion' }
      } else {
        return { token: 'ExplainLoop' }
      }
    }
  }
]

export default AT_EXPLANATION
