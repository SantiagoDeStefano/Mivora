import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import userApi from '../../../apis/users.api'
import path from '../../../constants/path'

export default function EmailVerification() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return
    ;(async () => {
      await userApi.verifyEmail({ email_verify_token: token })
      navigate(path.login)
    })()
  }, [searchParams, navigate])

  return <div>Verifying…</div>
}
