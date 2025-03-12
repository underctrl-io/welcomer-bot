import { Link } from 'react-router';

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
  return (
    <header className='h-20 flex items-center justify-between'>
      <Link to='/' className='btn btn-soft'>
        <img src='/logo.png' alt='Welcomer' className='size-6 mr-1.5' />
        Welcomer Bot
      </Link>

      <Link to={API_URL + '/auth/logout'} className='btn btn-error btn-soft'>
        Logout
      </Link>
    </header>
  );
}
