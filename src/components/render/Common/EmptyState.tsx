interface IEmptyStateProps {
  message?: string;
}

/**
 * Componente de estado vacío para PurchaseAuthorizationDetail
 */
export const EmptyState = ({ message = "No se encontró información de la orden de compra" }: IEmptyStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center py-10 gap-4">
      <div className="text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <span className="text-gray-600 text-center">{message}</span>
    </div>
  );
};
