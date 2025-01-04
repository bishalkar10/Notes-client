import '../styles/Loader.css';

interface LoaderProps {
  type?: 'spinner' | 'pulse';
}

function Loader({ type = 'spinner' }: LoaderProps) {
  return (
    <div className="loader-container">
      <div className={`loader ${type}`}></div>
    </div>
  );
};

export default Loader; 