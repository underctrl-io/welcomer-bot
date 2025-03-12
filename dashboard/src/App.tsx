import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import AuthLayout from './components/AuthLayout';
import Error from './components/Error';
import Layout from './components/Layout';
import Guild from './pages/Guild';
import Index from './pages/Index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthLayout>
          <Layout>
            <AppRoutes />
          </Layout>
        </AuthLayout>
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/guild/:guildId' element={<Guild />} />
      <Route
        path='*'
        element={
          <Error
            error='404 Page not found.'
            button={{ href: '/', text: 'Return to my servers' }}
          />
        }
      />
    </Routes>
  );
}
