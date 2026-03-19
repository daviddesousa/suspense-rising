import haslowMp4 from '../assets/haslow/haslow.mp4';
import haslowWebm from '../assets/haslow/haslow.webm';
import haslowPoster from '../assets/haslow/haslow-poster.webp';

const HaslowBackground = () => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="w-full h-full object-contain"
      poster={haslowPoster}
    >
      <source src={haslowMp4} type="video/mp4" />
      <source src={haslowWebm} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
};

export default HaslowBackground;
