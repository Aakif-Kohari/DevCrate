/**
 * Renders the DevCrate toolbox mark with the same static colors as the favicon.
 * The fixed palette keeps the brand consistent across light and dark themes.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="#4F46E5" />
      <path
        d="M15 19 V15 A5 5 0 0 1 20 10 A5 5 0 0 1 25 15 V19"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="10" y="19" width="20" height="13" rx="3" fill="#FFFFFF" />
      <rect x="10" y="23.5" width="20" height="3" fill="#4F46E5" />
    </svg>
  )
}
