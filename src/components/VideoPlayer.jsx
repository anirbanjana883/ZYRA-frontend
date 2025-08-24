import React, { useEffect, useRef, useState } from "react";
import { IoVolumeMediumOutline, IoVolumeMuteOutline } from "react-icons/io5";

function VideoPlayer({ media }) {
  const videoTag = useRef();
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleClick = () => {
    if (isPlaying) {
      videoTag.current.pause();
      setIsPlaying(false);
    } else {
      videoTag.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // prevent pausing video when clicking mute button
    videoTag.current.muted = !mute;
    setMute(!mute);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const video = videoTag.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoTag.current) {
      observer.observe(videoTag.current);
    }

    return () => {
      if (videoTag.current) {
        observer.unobserve(videoTag.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        className="w-full h-full object-cover cursor-pointer rounded-2xl"
        onClick={handleClick}
      />

      {/* Mute/Unmute button (Top Right) */}
      <div
        className="absolute top-5 right-2 text-white bg-black/50 p-2 rounded-full z-50"
        onClick={toggleMute}
      >
        {mute ? (
          <IoVolumeMuteOutline size={19} />
        ) : (
          <IoVolumeMediumOutline size={19} />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
