import { format } from "date-fns"

const formatDate = (date) => {
  return format(new Date(date), "dd MMM yyyy")
}

export default formatDate
