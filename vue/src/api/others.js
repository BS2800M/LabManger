import { myrequest } from './request'

export const api_others_time = () => {
  return myrequest.get('/others/time', {})
}
