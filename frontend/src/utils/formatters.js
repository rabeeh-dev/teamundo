/**
 * Format a profession value to display label
 * e.g. 'government_official' → 'Government Official'
 */
export const formatProfession = (profession) => {
  if (!profession) return 'Professional';
  return profession.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * Get initials from a name
 * e.g. 'John Doe' → 'JD'
 */
export const getInitials = (name) => {
  return (name || '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};
