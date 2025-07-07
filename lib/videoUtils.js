/**
 * Generates a simple video name based on topic and timestamp
 * @param {string} topic - The video topic
 * @param {string} duration - Video duration
 * @returns {string} Generated video name
 */
export const generateSimpleVideoName = (topic, duration) => {
  if (!topic) {
    return `AI Video - ${new Date().toLocaleDateString()}`;
  }

  // Clean and capitalize topic
  const cleanTopic = topic
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Limit length and add duration
  if (cleanTopic.length > 40) {
    return `${cleanTopic.substring(0, 37)}...`;
  }
  
  return `${cleanTopic} (${duration}s)`;
};

/**
 * Validates and sanitizes video name
 * @param {string} name - Video name to validate
 * @returns {string} Sanitized video name
 */
export const sanitizeVideoName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'Untitled Video';
  }

  return name
    .trim()
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .substring(0, 255) // Limit length
    || 'Untitled Video';
};
