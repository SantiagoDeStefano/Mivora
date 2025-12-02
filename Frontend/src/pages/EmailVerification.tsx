import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import userApi from '../apis/users.api'

export default function EmailVerification() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    console.log(token)
    if (!token) return
    ;(async () => {
      await userApi.verifyEmail({ email_verify_token: token })
    })()
  }, [searchParams, navigate])

  return <div>Verifying…</div>
}
