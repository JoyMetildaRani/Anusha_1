import * as FileSystem from 'expo-file-system';

/**
 * Converts a local image file to a base64-encoded string.
 * @param {string} imageUri - The URI of the local image file.
 * @returns {Promise<string>} - A promise that resolves to the base64-encoded string.
 */
const convertImageToBase64 = async (imageUri) => {
  try {
    // Check if the file exists before trying to read it
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Read file as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};
