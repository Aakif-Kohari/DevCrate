import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span className="text-6xl">🧭</span>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        Whatever you were looking for isn't here. It might have moved, or never existed.
      </p>
      <Link
        to="/"
        className="focus-ring flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        Back to home <ArrowRight size={15} />
      </Link>
    </div>
  )
}
