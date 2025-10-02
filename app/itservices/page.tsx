// components/FullScreenIframe.js

const FullScreenIframe = () => {
    const src = "https://itservices-two.vercel.app";
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 9999,
    }}>
      <iframe
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Full Screen Iframe"
      />
    </div>
  );
};

export default FullScreenIframe;