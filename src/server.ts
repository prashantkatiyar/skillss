import express, { Request, Response } from "express";
import multer from "multer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

interface Chapter {
  id: number;
  title: string;
  timestamp: number;
}

let chaptersDB: Chapter[] = [];
let chapterIdCounter = 1;

// Dummy function to simulate video processing and chapter generation
function processVideo(fileBuffer: Buffer): Chapter[] {
  return [
    { id: chapterIdCounter++, title: "Introduction", timestamp: 0 },
    { id: chapterIdCounter++, title: "Process Overview", timestamp: 30 },
    { id: chapterIdCounter++, title: "Safety Instructions", timestamp: 60 },
  ];
}

app.post(
  "/api/upload",
  upload.single("video"),
  (req: Request, res: Response) => {
    try {
      const { title, plantUnit, asset, category } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: "No video file provided." });
      }

      // For testing, return a placeholder video URL
      const videoUrl = `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`;

      const generatedChapters = processVideo(req.file.buffer);
      chaptersDB = generatedChapters;

      res.json({ videoUrl, chapters: generatedChapters });
    } catch (err) {
      console.error("Error in /api/upload:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

app.put("/api/chapters/:id", (req: Request, res: Response) => {
  const chapterId = Number(req.params.id);
  const { title, timestamp } = req.body;
  const chapter = chaptersDB.find((ch) => ch.id === chapterId);
  if (!chapter) {
    return res.status(404).json({ error: "Chapter not found." });
  }
  chapter.title = title;
  chapter.timestamp = timestamp;
  res.json(chapter);
});

app.post("/api/chapters", (req: Request, res: Response) => {
  const { title, timestamp } = req.body;
  const newChapter: Chapter = { id: chapterIdCounter++, title, timestamp };
  chaptersDB.push(newChapter);
  res.json(newChapter);
});

app.delete("/api/chapters/:id", (req: Request, res: Response) => {
  const chapterId = Number(req.params.id);
  chaptersDB = chaptersDB.filter((ch) => ch.id !== chapterId);
  res.json({ success: true });
});

// Optionally serve static files if needed
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
