// components/ui/ErrorMessage.tsx

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`p-4 bg-red-50 border border-red-300 rounded-lg ${className}`}>
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}