import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import userApi from '../../../apis/users.api'
import path from '../../../constants/path'

export default function VerifyForgotPasswordToken() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return
    ;(async () => {
      await userApi.verifyForgotPassword({ forgot_password_token: token })
      navigate(path.reset_password, { state: { forgot_password_token: token } })
    })()
  }, [searchParams, navigate])

  return <div>Verifying reset link…</div>
}
