import DataUriParser from "datauri/parser.js";

import path from "path";

const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toLowerCase();
  return parser.format(extName.trim(".").concat("jpg"), file.buffer);
};

export default getDataUri;
