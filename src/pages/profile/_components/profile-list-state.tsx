import ErrorSection from "@/components/custom/error-section";
import LoadingSection from "@/components/custom/loading-section";

export function ProfileListLoading() {
  return (
    <div className="flex min-h-72 items-center justify-center">
      <LoadingSection />
    </div>
  );
}

type ProfileListErrorProps = {
  onRetry: () => void;
};

export function ProfileListError({ onRetry }: ProfileListErrorProps) {
  return (
    <div className="flex min-h-72 items-center justify-center">
      <ErrorSection onRetry={onRetry} />
    </div>
  );
}

type ProfileListEmptyProps = {
  title: string;
};

export function ProfileListEmpty({ title }: ProfileListEmptyProps) {
  return (
    <div className="text-muted-foreground flex min-h-72 items-center justify-center text-sm">
      {title}
    </div>
  );
}
