import { Link } from 'react-router';

type Props = {
  error: string;
  button?: {
    href: string;
    text: string;
    variant?: 'primary' | 'secondary' | 'accent';
  };
};

export default function Error({ error, button }: Props) {
  return (
    <div className='container my-32 text-center'>
      <img src='/warning.svg' alt='Error' className='w-72 mx-auto mb-10' />

      <div className='text-xl md:text-2xl font-semibold mb-6 max-w-lg mx-auto'>
        {error}
      </div>
      {button && (
        <Link
          to={button.href}
          className={`btn btn-${button.variant || 'neutral'}`}
        >
          {button.text}
        </Link>
      )}
    </div>
  );
}
