import React, { useEffect, useRef, useState } from 'react';
import Hls, { Events, Fragment } from 'hls.js';
import { API_CLIENT } from '../util/ApiClient';
import { toast } from 'react-toastify';



interface Marker {
  startTime: number;
  label: string;
}

interface HLSPlayerProps {
  videoUrl: string;
  markers: Marker[];
  id: string;
}

interface IChapter {
  title: string;
  startTime: number;
  endTime: number;
  image?: string;
}

export const HLSPlayer: React.FC<HLSPlayerProps> = ({ videoUrl, markers, id }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [snapshots, setSnapshots] = useState<{ [key: number]: string }>({});
  const hlsRef = useRef<Hls | null>(null);
  const notify = (message: string) => toast(message)
  const [chapters, setChapters] = useState<Array<IChapter>>([]);

  const [chapter, setChapter] = useState<IChapter>({
    title: "",
    startTime: 0,
    endTime: 0,
  });

  useEffect(() => {
    console.log("chapters", chapters);
  }, [chapters]);

  useEffect(() => {
    console.log('chapter', chapter);
  }, [chapter]);

  useEffect(() => {
    if (Hls.isSupported() && videoUrl) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current!);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsVideoReady(true);
      });

      // Listen for fragment changes to see if it's the desired fragment for capturing snapshots
      hls.on(Hls.Events.FRAG_CHANGED, (event: Events.FRAG_CHANGED, data: { frag: any }) => {
        markers.forEach((marker) => {
          if (
            marker.startTime >= data.frag.startPTS &&
            marker.startTime <= data.frag.endPTS &&
            !snapshots[marker.startTime] // Only capture if snapshot hasn't been taken
          ) {
            // captureSnapshot(marker);
          }
        });
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = videoUrl;
      videoRef.current.addEventListener('loadedmetadata', () => {
        setIsVideoReady(true);
      });
    }
  }, [videoUrl, markers, snapshots]);

  const captureVideoSnapshot = (
    videoElement: HTMLVideoElement | null,
    timeInSeconds: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoElement) {
        return reject(new Error('Video element is not available.'));
      }

      const handleSeeked = () => {
        // Wait for the video to reach the desired frame, then capture the snapshot
        setTimeout(() => {
          try {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (!context) {
              throw new Error('Canvas context could not be created.');
            }

            // Set canvas dimensions to match the video dimensions
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            // Draw the video frame on the canvas
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Get the snapshot as a data URL (Base64 image)
            const snapshot = canvas.toDataURL('image/png');

            // Clean up the event listener
            videoElement.removeEventListener('seeked', handleSeeked);

            // Resolve the promise with the snapshot data
            resolve(snapshot);
          } catch (error) {
            reject(error);
          }
        }, 200); // Optional delay to ensure the frame is stable
      };

      // Add event listener to execute the snapshot capture when seeking completes
      videoElement.addEventListener('seeked', handleSeeked);

      // Set the video time to the desired snapshot point
      videoElement.currentTime = timeInSeconds;
    });
  };

  const handleSelectMarker = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;

      videoRef.current.addEventListener(
        'seeked',
        () => {
          videoRef.current?.play().catch((e) => {
            console.error('Error trying to play the video:', e);
          });
        },
        { once: true }
      );
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.error('Error trying to play the video:', e);
      });
    }
  };


  const handleAddChapter = async (e: any) => {
    if (chapter.startTime) {
      const image = await captureVideoSnapshot(videoRef.current, chapter.startTime);
      const base64Image = image.split(',')[1];
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });
      const formData = new FormData();
      formData.append('id', id);
      formData.append('chapter', JSON.stringify({ ...chapter, image: undefined })); 
      formData.append('image', blob, 'snapshot.png');
      console.log("snapshot", image);
      setChapters((prev) => [...prev, { ...chapter, image }]);
      setChapter({
        title: "",
        startTime: 0,
        endTime: 0,
      });
      try {
        const { data } = await API_CLIENT.post('/api/video/chapter/create', formData);
        notify(data?.message)
      } catch (e: any) {
        notify("Error while creating chapter");
      }

    }

  }

  const handleChangeChapter = (e: any) => {
    let { name, value } = e.target;
    if (name === "startTime" || name === "endTime") value = parseInt(value);
    setChapter(prev => ({
      ...prev,
      [name]: value
    }));

  }

  return (
    <div style={{ position: 'relative', width: '640px', height: '360px', overflowY: 'scroll' }}>
      <video
        ref={videoRef}
        controls
        width="100%"
        height="100%"
        style={{ width: '100%', height: '80%' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!isVideoReady && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handlePlay}
        >
          Click to Play
        </div>
      )}
      <div style={{ background: '#FFFFFF' }}>
        <h5>Add Chapters</h5>
        <div style={{ display: 'flex', alignItems: "center", gap: '20px', padding: '30px' }}>
          <div className="form-group" style={{ textAlign: 'start' }}>
            <label>Label</label>
            <input type='text' name='title' value={chapter.title} onChange={handleChangeChapter} />
          </div>
          <div className="form-group" style={{ textAlign: 'start' }}>
            <label>Start Time</label>
            <input type='number' name='startTime' value={chapter.startTime} onChange={handleChangeChapter} />
          </div>
          <div className="form-group" style={{ textAlign: 'start' }}>
            <label>End Time</label>
            <input type='number' name='endTime' value={chapter.endTime} onChange={handleChangeChapter} />
          </div>
          <button className="button" style={{ height: '50px' }} onClick={handleAddChapter}>Add</button>
        </div>
        {
          chapters.map((chapter, index) => (
            <div style={{ display: 'flex', alignItems: "center", gap: '20px', padding: '30px' }}>
              <div className="form-group" style={{ textAlign: 'start' }}>
                <label>Label</label>
                <input type='text' name='title' value={chapter.title} onChange={handleAddChapter} />
              </div>
              <div className="form-group" style={{ textAlign: 'start' }}>
                <label>Start Time</label>
                <input type='number' name='startTime' value={chapter.startTime} />
              </div>
              <div className="form-group" style={{ textAlign: 'start' }}>
                <label>End Time</label>
                <input type='number' name='endTime' value={chapter.endTime} />
              </div>
              <img src={chapter.image} style={{ width: '90px', height: '60px' }} />
            </div>
          ))
        }
        <div>
        </div>
      </div>
    </div>
  );
};

export default HLSPlayer;
