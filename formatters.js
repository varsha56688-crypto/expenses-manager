/**
 * Formats a numeric value into Indian Rupees (₹) with clean comma separators.
 * e.g., 12500 -> "₹ 12,500"
 * e.g., 125000 -> "₹ 1,25,000"
 * e.g., 2450.50 -> "₹ 2,450.50"
 */
export const formatINR = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const { showDecimals = false, compact = false } = options;

  if (compact && Math.abs(num) >= 10000000) {
    // Crores
    return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  }
  if (compact && Math.abs(num) >= 100000) {
    // Lakhs
    return `₹ ${(num / 100000).toFixed(2)} L`;
  }

  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `₹ ${formatted}`;
};

/**
 * Formats ISO date string into readable fintech display date.
 * e.g. "Oct 9, 2026"
 */
export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Relative date description (e.g. "Today", "Yesterday", "3 days ago")
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDateDisplay(dateStr);
};
