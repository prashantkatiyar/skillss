import React, { useState, useRef } from "react";
import VideoUploadForm from "./VideoUploadForm";
import ChapterList from "./ChapterList";

export interface Chapter {
  id: number;
  title: string;
  timestamp: number;
}

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handler to jump to a specific chapter timestamp
  const handleChapterClick = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">
        Video Work Instruction Management
      </h1>

      <VideoUploadForm
        onUploadSuccess={({ videoUrl, chapters }) => {
          setVideoUrl(videoUrl);
          setChapters(chapters);
        }}
      />

      {videoUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Video Player</h2>
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full max-w-xl border"
          />
        </div>
      )}

      {chapters.length > 0 && (
        <ChapterList
          chapters={chapters}
          setChapters={setChapters}
          onChapterClick={handleChapterClick}
        />
      )}
    </div>
  );
};

export default App;
