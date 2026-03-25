import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate: React.FC<Auth0ProviderWithNavigateProps> = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || "/camera");
  };

  if (!domain || !clientId) {
    // Auth0 not configured — skip auth, go straight to camera
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + "/camera"
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
