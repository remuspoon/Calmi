import openai from '.'

export const isSuicidal = async (text: string) => {
  const prompt = `Does this response suggest the person is suicidal, harmful to themselves or others, or in immediate risk of danger: ${text} \nAnswer either 'yes' or 'no'`

  const result = await openai.completions.create({
    model: 'text-davinci-002',
    prompt,
    temperature: 0
  })

  const response = result.choices[0].text
  return response.toLowerCase().includes('yes')
}

export const provideEmpathy = async (text: string) => {}
