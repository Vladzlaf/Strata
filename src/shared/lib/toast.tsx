import { toast as notify } from 'react-toastify'

export const toast = (message: string) =>
  notify(message, {
    icon: (
      <svg
        aria-hidden
        fill="none"
        height="18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
      </svg>
    ),
  })
