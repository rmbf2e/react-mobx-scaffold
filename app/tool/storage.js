import localforage from 'localforage'

const storage = localforage.createInstance({
  name: 'appStorage',
})

export default storage
