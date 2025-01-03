import { useEffect } from 'react'
import { useNavigate } from 'umi'

const HomePage = () => {
  let navigate = useNavigate()
  useEffect(() => {
    navigate('/system/setting', { replace: true })
  }, [])

  return null
}

export default HomePage
