import formidable, { File } from 'formidable'
import { Request } from 'express'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'

import fs from 'fs'

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
    maxFileSize: 1000 * 1024, //1000KB
    maxTotalFileSize: 1 * 1000 * 1024,
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
        return reject(new Error('File can not be empty'))
      }
      resolve(files.image as File[])
    })
  })
}
