interface StateDisplayProps {
  onBack: () => void;
  icon: string;
  title: string;
  subtitle?: string;
  showButton?: boolean;
}

const StateDisplay = ({
  onBack,
  icon,
  title,
  subtitle,
  showButton = true,
}: StateDisplayProps) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-lg text-gray-600 mb-4">{title}</p>
      {subtitle && <p className="text-4xl mt-2">{subtitle}</p>}
      {showButton && (
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#19B6C8] text-white rounded-lg hover:bg-[#148A9C] transition-colors"
        >
          ← Back to list
        </button>
      )}
    </div>
  </div>
);

export const LoadingState = ({ onBack }: { onBack: () => void }) => (
  <StateDisplay
    onBack={onBack}
    icon="🔄"
    title="Loading character details..."
    subtitle="🍫"
    showButton={false}
  />
);

export const ErrorState = ({
  error,
  onBack,
}: {
  error: string;
  onBack: () => void;
}) => <StateDisplay onBack={onBack} icon="❌" title={`Error: ${error}`} />;

export const NotFoundState = ({ onBack }: { onBack: () => void }) => (
  <StateDisplay onBack={onBack} icon="🔍" title="Character not found" />
);
