import haslowVideo from '../assets/haslow/Haslow-Canvas-Edit-2.5k.mp4'; // TODO optimize + compress video

const HaslowBackground = () => {
  return (
    <div className="sticky top-0 w-full h-svh -z-1 after:absolute after:inset-0 after:bg-black/70">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
      >
        <source src={haslowVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HaslowBackground;
