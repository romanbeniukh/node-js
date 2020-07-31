import { execFile } from 'child_process';
import mozjpeg from 'mozjpeg';
import { promises } from 'fs';
import path from 'path';

export async function compressorImg(req, res, next) {
  const { path: uncompressedFilePath, filename } = req.file || {};
  if (!uncompressedFilePath) {
    return next();
  }
  const OUTPUT_FILE_LINK = `${process.env.COMPRESED_FILES_LINK}${filename}`;

  execFile(mozjpeg, [`-outfile`, OUTPUT_FILE_LINK, uncompressedFilePath]);

  setTimeout(() => {
    promises.unlink(uncompressedFilePath);
  }, 3000);

  req.file.path = path.join(
    __dirname,
    process.env.ROOT_CATALOG_LINK,
    OUTPUT_FILE_LINK
  );

  next();
}
