export default function initials(input: string, limit: number = 2) {
  // Split the input string into words
  const words = input.split(' ')

  // Initialize an empty string to store the initials
  let result = ''

  // Loop through each word and extract the first letter
  for (let i = 0; i < Math.min(words.length, limit); i++) {
    const word = words[i]

    if (word.length > 0) {
      result += word[0]
    }
  }

  return result
}
