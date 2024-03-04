export default interface Filters {
  name: string | null
  features: {
    enableEditor: boolean
  }
  browsers: boolean
  terminals: boolean
  docker: {
    enableComposer: boolean
    enableContainers: boolean
  }
}
