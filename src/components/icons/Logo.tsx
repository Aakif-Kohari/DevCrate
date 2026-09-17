// The DevCrate mark: a simple toolbox badge in the brand's primary indigo.
// Kept as a static brand color (not the --primary CSS variable) since a
// logo should read the same in light and dark mode, matching the favicon
// (public/favicon.svg) and the theme-color meta tag in index.html — all
// three need to agree, so this is the one source of truth for the shape.
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
