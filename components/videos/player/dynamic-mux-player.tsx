import dynamic from 'next/dynamic'

const DynamicMuxPlayer = dynamic(() => import('./video-player'), {
  ssr: false
});

export default DynamicMuxPlayer;
