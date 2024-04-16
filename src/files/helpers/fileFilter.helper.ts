

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if(!file) return callback(new Error('File is empty'), false);
    const fileExtension = file.mimetype.split('/')[1];
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const isAllowed = allowedExtensions.includes(fileExtension);
    if(!isAllowed) return callback(new Error('Invalid file type'), false);

  callback(null, true);
}