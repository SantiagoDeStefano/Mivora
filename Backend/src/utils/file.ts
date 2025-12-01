import formidable, { File } from 'formidable'
import { Request } from 'express'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'

import fs from 'fs'
import ErrorWithStatus, { EntityError } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const getNameFromFullname = (fullname: string) => {
  const name = fullname.split('.')
  name.pop()
  return name.join('')
}

export const handleUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1, // Max 1 files a time
    keepExtensions: true,
    // maxFileSize: 1000 * 1024, //1 MB
    // maxTotalFileSize: 1 * 1000 * 1024, //1 MB

    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image || files.image.length === 0) {
        return reject(
          new EntityError({
            errors: {
              image: {
                type: 'field',
                value: null, // or null
                msg: USERS_MESSAGES.IMAGE_IS_REQUIRED,
                path: 'image',
                location: 'files'
              }
            }
          })
        )
      }
      const file = (files.image as File[])[0]
      const MAX_SIZE = 1000 * 1024 // 1 MB

      if (file.size > MAX_SIZE) {
        return reject(
          new EntityError({
            errors: {
              image: {
                type: 'field',
                value: file.originalFilename,
                msg: USERS_MESSAGES.IMAGE_TOO_LARGE,
                path: 'image',
                location: 'files',
              }
            }
          })
        )
      }
      resolve(files.image as File[])
    })
  })
}
