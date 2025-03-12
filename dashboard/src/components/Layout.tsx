import Header from './Header';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className='container space-y-3'>
      <Header />
      <main className='mb-20'>{children}</main>
    </div>
  );
}
