export default interface Filters {
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
