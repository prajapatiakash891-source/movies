/**
 * Optimizes image URLs (e.g. Unsplash) with WebP format, quality, and target width.
 * @param {string} url - Original image URL
 * @param {Object} options
 * @param {number} [options.width=400] - Target width in pixels
 * @param {number} [options.quality=75] - Target JPEG/WebP quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (url, { width = 400, quality = 75 } = {}) => {
  if (!url || typeof url !== 'string') return url;

  // Optimize Unsplash images
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('auto', 'format');
      parsedUrl.searchParams.set('fit', 'crop');
      parsedUrl.searchParams.set('fm', 'webp');
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', quality.toString());
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
};

export default getOptimizedImageUrl;
