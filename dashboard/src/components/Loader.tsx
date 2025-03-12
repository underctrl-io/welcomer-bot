export default function Loader({ text }: { text: string }) {
  return (
    <div className='container text-2xl font-semibold text-center my-32'>
      <span className='loading loading-spinner loading-xl mr-3' /> {text}
    </div>
  );
}
