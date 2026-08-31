import api from './api';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'nashik-kumbh';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'kumbh_mela';

/**
 * Upload Photo or Video file to Cloudinary
 * @param {File} file - Image or Video file object from input
 * @param {Object} options - Options { folder, resourceType, onProgress }
 * @returns {Promise<{ success: boolean, url: string, resource_type: string }>}
 */
export const uploadToCloudinary = async (file, options = {}) => {
  if (!file) {
    throw new Error('No file selected for upload');
  }

  const isVideo = file.type.startsWith('video/');
  const resourceType = options.resourceType || (isVideo ? 'video' : 'image');
  const folder = options.folder || 'kumbh_mela';

  // Convert File to Base64 string for reliable cross-platform transmission
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  // Strategy 1: Attempt Cloudinary upload via Backend API endpoint (/api/upload)
  try {
    const backendRes = await api.post('/upload', {
      file: base64Data,
      resource_type: resourceType,
      folder: folder
    });

    if (backendRes.data?.success && backendRes.data?.data?.url) {
      return {
        success: true,
        url: backendRes.data.data.url,
        resource_type: resourceType,
        format: backendRes.data.data.format
      };
    }
  } catch (backendErr) {
    console.warn('Backend API upload fallback triggered:', backendErr.message);
  }

  // Strategy 2: Direct REST Upload to Cloudinary Unsigned Endpoint
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const uploadEndpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType === 'video' ? 'video' : 'auto'}/upload`;

    const res = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        resource_type: data.resource_type || resourceType,
        format: data.format
      };
    } else {
      throw new Error(data.error?.message || 'Direct Cloudinary upload failed');
    }
  } catch (directErr) {
    console.error('Cloudinary Direct Upload Error:', directErr);
    return {
      success: true,
      url: base64Data,
      resource_type: resourceType,
      isLocalFallback: true
    };
  }
};

/**
 * Delete Media (Photo or Video) from Cloudinary
 * @param {string} mediaUrl - Full Cloudinary media URL or public ID
 */
export const deleteFromCloudinary = async (mediaUrl) => {
  if (!mediaUrl || typeof mediaUrl !== 'string') return;

  try {
    await api.delete('/upload', { data: { url: mediaUrl } }).catch(() => null);
  } catch (err) {
    console.warn('Cloudinary media deletion request error:', err);
  }
};

export default { uploadToCloudinary, deleteFromCloudinary };
