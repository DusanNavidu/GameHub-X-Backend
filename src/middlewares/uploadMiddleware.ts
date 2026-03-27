import multer from "multer";

// File එක Hard Disk එකට ලියන්නේ නැතුව Memory එකේ තියාගන්නවා (Buffer විදිහට)
const storage = multer.memoryStorage();

export const upload = multer({ storage });