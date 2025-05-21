import { history } from 'umi'

const Form = () => {
  return (
    <div>
      form
      <button onClick={() => history.back()}>back</button>
    </div>
  )
}

export default Form
