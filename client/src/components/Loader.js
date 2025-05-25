import Lottie from 'lottie-react';
import loadingAnimation from './animations/Loading.json';

const Loader = () => {
  return (
    <div style={{ width: 400, margin: '0 auto' }}>
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default Loader;