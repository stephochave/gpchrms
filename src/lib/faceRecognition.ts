/**
 * Face Recognition Utility
 * Compares captured face with registered face to verify identity
 */

/**
 * Load images and convert to ImageData for comparison
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Convert image to canvas and get ImageData
 */
const imageToImageData = (img: HTMLImageElement): ImageData => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

/**
 * Calculate structural similarity index (SSIM) between two images
 * This is a simplified version - for production, use a proper face recognition library
 */
const calculateImageSimilarity = (
  imgData1: ImageData,
  imgData2: ImageData
): number => {
  // Resize both images to same size for comparison
  const size = Math.min(imgData1.width, imgData2.width, 100);
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  canvas1.width = size;
  canvas1.height = size;
  canvas2.width = size;
  canvas2.height = size;
  
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  if (!ctx1 || !ctx2) return 0;

  // Draw and resize images
  const tempImg1 = new Image();
  const tempImg2 = new Image();
  
  // For now, use a simple pixel comparison
  // In production, use face-api.js or a server-side face recognition service
  return 0.5; // Placeholder - will be replaced with actual comparison
};

/**
 * Compare two face images
 * Returns a similarity score between 0 and 1
 * Threshold: 0.6 (60% similarity) is typically used for face recognition
 */
export const compareFaces = async (
  registeredFaceUrl: string,
  capturedFaceDataUrl: string
): Promise<{ similar: boolean; similarity: number }> => {
  try {
    // Load both images
    const [registeredImg, capturedImg] = await Promise.all([
      loadImage(registeredFaceUrl),
      loadImage(capturedFaceDataUrl),
    ]);

    // Convert to ImageData
    const registeredData = imageToImageData(registeredImg);
    const capturedData = imageToImageData(capturedImg);

    // Calculate similarity
    const similarity = calculateImageSimilarity(registeredData, capturedData);

    // Threshold for face recognition (typically 0.6-0.7)
    const threshold = 0.6;
    const similar = similarity >= threshold;

    return { similar, similarity };
  } catch (error) {
    console.error('Error comparing faces:', error);
    // If comparison fails, reject for security
    return { similar: false, similarity: 0 };
  }
};

/**
 * Server-side face comparison endpoint
 * This should be implemented on the backend for better security and accuracy
 */
export const compareFacesServer = async (
  employeeId: string,
  capturedFaceDataUrl: string
): Promise<{ similar: boolean; similarity: number }> => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/verify-face`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId,
        faceImage: capturedFaceDataUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Face verification failed');
    }

    const data = await response.json();
    return {
      similar: data.similar || false,
      similarity: data.similarity || 0,
    };
  } catch (error) {
    console.error('Error verifying face on server:', error);
    return { similar: false, similarity: 0 };
  }
};

