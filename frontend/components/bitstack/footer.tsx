export function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div
            aria-hidden
            className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h6a3 3 0 0 1 0 6H4z" />
              <path d="M4 13h7a3 3 0 0 1 0 6H4z" />
            </svg>
          </div>
          <div className="text-sm">
            <span className="font-medium">BitStack</span>
            <span className="text-muted-foreground ml-2">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
