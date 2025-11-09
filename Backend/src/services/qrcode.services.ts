import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import { UUIDv4 } from '~/types/common'
import { signToken, verifyToken } from '~/utils/jwt'
import QRCodeLib from 'qrcode'
import databaseService from './database.services'

class QRCode {
  async createQrTicketToken(event_id: UUIDv4, user_id: UUIDv4) {
    const signedQrToken = await this.signTicketQR({ event_id, user_id })
    return signedQrToken
  }
  async generateQrTicketCode(qr_code_token: string) {
    const qr_code = await QRCodeLib.toDataURL(qr_code_token)
    return qr_code
  }
  private async getTicketQrToken(user_id: UUIDv4) {
    const qrToken = await databaseService.tickets(
      `
        SELECT qr_code_token FROM tickets WHERE user_id=$1
      `,
      [user_id]
    )
    return qrToken.rows[0]
  }
  private signTicketQR({ event_id, user_id }: { event_id: UUIDv4; user_id: UUIDv4 }) {
    return signToken({
      payload: {
        event_id,
        user_id,
        tokenType: TokenType.QRCodeToken
      },
      privateKey: envConfig.jwtSecretQRCodeToken as string
    }) as Promise<string>
  }
  private decodeTicketQR(qr_code: string) {
    return verifyToken({
      token: qr_code,
      secretOrPublicKey: envConfig.jwtSecretQRCodeToken as string
    })
  }
}

const qrCode = new QRCode()
export default qrCode
