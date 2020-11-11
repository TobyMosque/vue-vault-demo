import axios from 'axios'
import inject from './inject '

export default inject((_) => {
  return {
    axios: axios.create()
  }
})
