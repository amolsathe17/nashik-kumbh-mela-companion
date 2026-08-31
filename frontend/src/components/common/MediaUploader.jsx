import React, { useState } from 'react';
import { Upload, Trash2, Video, Image as ImageIcon, CheckCircle, Loader2, Cloud } from 'lucide-react';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const MediaUploader = ({ 
  value = '', 
  onChange, 
  label = 'Media Content (Photo or Video)',
  accept = 'image/*,video/*',
  folder = 'kumbh_mela'
}) => {
  const [uploading, setUploading] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isVideo = (urlStr) => {
    if (!urlStr) return false;
    const s = String(urlStr).toLowerCase();
    return s.includes('/video/') || s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.startsWith('data:video');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg('');
      const fileTypeLabel = file.type.startsWith('video/') ? 'video' : 'photo';
      setProgressStatus(`Uploading ${fileTypeLabel} to Cloudinary...`);

      const result = await uploadToCloudinary(file, { folder });

      if (result && result.url) {
        onChange(result.url);
        setProgressStatus('Successfully uploaded to Cloudinary!');
        setTimeout(() => setProgressStatus(''), 3000);
      }
    } catch (err) {
      console.error('Media upload error:', err);
      setErrorMsg(err.message || 'Failed to upload media to Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-sky-600" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold border border-sky-200/60 flex items-center gap-1">
          ☁️ Cloudinary Enabled
        </span>
      </div>

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group bg-slate-950">
          {isVideo(value) ? (
            <video 
              src={value} 
              controls 
              className="w-full h-48 object-cover rounded-2xl"
            />
          ) : (
            <img 
              src={value} 
              alt="Media Preview" 
              className="w-full h-44 object-cover" 
            />
          )}

          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label className="cursor-pointer px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-sky-600" />
              <span>Change File</span>
              <input 
                type="file" 
                accept={accept}
                className="hidden" 
                onChange={handleFileChange} 
                disabled={uploading}
              />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3.5 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <label className={`border-2 border-dashed ${uploading ? 'border-sky-400 bg-sky-50/60' : 'border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/40'} rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-7 h-7 text-sky-600 animate-spin" />
              <p className="text-xs font-bold text-sky-900">{progressStatus || 'Uploading to Cloudinary...'}</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">Click to Upload Photo or Video to Cloudinary</p>
                <p className="text-[10px] text-slate-500 font-medium">Supports JPG, PNG, WEBP photos and MP4, WEBM videos</p>
              </div>
              <input 
                type="file" 
                accept={accept}
                className="hidden" 
                onChange={handleFileChange} 
              />
            </>
          )}
        </label>
      )}

      {errorMsg && (
        <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
          ⚠️ {errorMsg}
        </p>
      )}

      {progressStatus && !uploading && (
        <p className="text-[11px] font-bold text-emerald-600 bg-emerald-50 p-2 rounded-xl border border-emerald-200 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" /> {progressStatus}
        </p>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste custom Cloudinary URL (e.g. https://res.cloudinary.com/...)"
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
      />
    </div>
  );
};

export default MediaUploader;
