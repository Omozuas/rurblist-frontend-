export function optimizeCloudinaryImage(
  url?: string,
  options: {
    width?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {},
) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const width = options.width ?? 800;
  const quality = options.quality ?? 'auto';
  const format = options.format ?? 'auto';

  return url.replace('/upload/', `/upload/f_${format},q_${quality},w_${width},c_limit/`);
}
