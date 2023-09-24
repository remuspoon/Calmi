import openai from '.'

export const isSuicidal = async (text: string) => {
  const prompt = `Does this response suggest the person is suicidal, harmful to themselves or others, or in immediate risk of danger: ${text} \nAnswer either 'yes' or 'no'`

  const result = await openai.completions.create({
    model: 'text-davinci-002',
    prompt,
    max_tokens: 1,
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ['\n']
  })

  const response = result.choices[0].text

  return response === 'yes'
}

export const provideEmpathy = async (text: string) => {}
