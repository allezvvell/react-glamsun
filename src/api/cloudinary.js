import axios from 'axios';

const CLOUD_NAME = 'dpujy3dch';
const UNSIGNED_NAME = 'jwgy3zcp';

export const uploadImage = async (imgUrl) => {
  if (!imgUrl) return;
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  try {
    const res = await axios.post(url, {
      file: imgUrl,
      upload_preset: UNSIGNED_NAME,
      asset_folder: 'glamSun',
    });
    return res.data.url;
  } catch (error) {
    console.log('uploadImage 에러', error);
    throw error;
  }
};
