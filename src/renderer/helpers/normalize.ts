export default function normalize(value: string) {
  return value?.replace(/[^a-zA-Z-_]/g, '')?.toLowerCase()
}
