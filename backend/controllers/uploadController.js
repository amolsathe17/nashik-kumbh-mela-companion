const cloudinary = require('cloudinary').v2;

// Configure Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'nashik-kumbh',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

/**
 * Upload Photo or Video to Cloudinary
 * POST /api/upload
 * Body: { file: base64Data, resource_type: 'auto'|'image'|'video', folder: 'kumbh_mela' }
 */
exports.uploadMedia = async (req, res) => {
  try {
    const { file, resource_type = 'auto', folder = 'kumbh_mela' } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file or base64 data provided for upload'
      });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'nashik-kumbh';
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'kumbh_mela';

    // If Cloudinary API credentials exist, use SDK uploader
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.upload(file, {
        resource_type: resource_type,
        folder: folder,
        use_filename: true,
        unique_filename: true
      });

      return res.status(200).json({
        success: true,
        message: 'Media uploaded successfully to Cloudinary',
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          duration: result.duration
        }
      });
    }

    // Direct REST API Uploader fallback (using Cloudinary API endpoint)
    const formData = new URLSearchParams();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resource_type === 'video' ? 'video' : 'auto'}/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.secure_url) {
      return res.status(200).json({
        success: true,
        message: 'Media uploaded successfully to Cloudinary',
        data: {
          url: data.secure_url,
          public_id: data.public_id,
          format: data.format,
          resource_type: data.resource_type || (data.duration ? 'video' : 'image'),
          bytes: data.bytes
        }
      });
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  } catch (error) {
    console.error('Cloudinary upload controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload file to Cloudinary: ' + error.message
    });
  }
};

/**
 * Delete Media (Photo or Video) from Cloudinary by URL or public_id
 * DELETE /api/upload
 * Body: { url: string, public_id?: string, resource_type?: 'image'|'video' }
 */
exports.deleteMedia = async (req, res) => {
  try {
    const { url, public_id, resource_type } = req.body || {};

    let targetPublicId = public_id;
    let targetResourceType = resource_type || 'image';

    if (!targetPublicId && url && typeof url === 'string' && url.includes('cloudinary.com')) {
      const isVideo = url.includes('/video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
      targetResourceType = isVideo ? 'video' : 'image';

      const parts = url.split('/upload/');
      if (parts.length > 1) {
        let afterUpload = parts[1];
        afterUpload = afterUpload.replace(/^v\d+\//, '');
        targetPublicId = afterUpload.substring(0, afterUpload.lastIndexOf('.')) || afterUpload;
      }
    }

    if (!targetPublicId) {
      return res.status(200).json({
        success: true,
        message: 'No Cloudinary public_id found to delete'
      });
    }

    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.destroy(targetPublicId, {
        resource_type: targetResourceType,
        invalidate: true
      });

      return res.status(200).json({
        success: true,
        message: `Media ${targetPublicId} successfully deleted from Cloudinary`,
        result
      });
    }

    return res.status(200).json({
      success: true,
      message: `Card deletion processed for media ${targetPublicId}`
    });
  } catch (error) {
    console.error('Cloudinary delete controller error:', error);
    return res.status(200).json({
      success: true,
      message: 'Processed deletion request: ' + error.message
    });
  }
};
