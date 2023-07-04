export interface RouteProps {
  path: string;
  component: React.ReactNode;
}
export const Route = ({ path, component }: RouteProps) => {
  const currentPath = window.location.pathname;

  if (currentPath === path) {
    return <>{component}</>;
  }

  return null;
};
