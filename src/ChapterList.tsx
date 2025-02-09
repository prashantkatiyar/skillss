import React, { useState } from "react";
import axios from "axios";
import { Chapter } from "./App";

interface ChapterListProps {
  chapters: Chapter[];
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
  onChapterClick: (timestamp: number) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  setChapters,
  onChapterClick,
}) => {
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedTimestamp, setEditedTimestamp] = useState<number>(0);

  // Update chapter on save
  const updateChapter = async (
    chapterId: number,
    updatedData: Partial<Chapter>
  ) => {
    try {
      await axios.put(`/api/chapters/${chapterId}`, updatedData);
      setChapters((prevChapters) =>
        prevChapters.map((ch) =>
          ch.id === chapterId ? { ...ch, ...updatedData } : ch
        )
      );
      setEditingChapterId(null);
    } catch (err) {
      console.error("Error updating chapter:", err);
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditedTitle(chapter.title);
    setEditedTimestamp(chapter.timestamp);
  };

  const handleDelete = async (chapterId: number) => {
    try {
      await axios.delete(`/api/chapters/${chapterId}`);
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
    } catch (err) {
      console.error("Error deleting chapter:", err);
    }
  };

  const handleAddChapter = async () => {
    try {
      const newChapter = {
        title: "New Chapter",
        timestamp: 0,
      };
      const response = await axios.post("/api/chapters", newChapter);
      setChapters((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error adding chapter:", err);
    }
  };

  return (
    <div className="mt-6 max-w-xl bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chapters</h2>
        <button
          onClick={handleAddChapter}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
        >
          Add Chapter
        </button>
      </div>
      <ul>
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            className="border-b py-2 flex items-center justify-between"
          >
            <div className="flex-1">
              {editingChapterId === chapter.id ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    value={editedTimestamp}
                    onChange={(e) => setEditedTimestamp(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-20"
                  />
                </div>
              ) : (
                // Only attach onClick when not editing
                <div
                  className="cursor-pointer"
                  onClick={() => onChapterClick(chapter.timestamp)}
                >
                  <span className="font-medium">{chapter.title}</span>{" "}
                  <span className="text-gray-600">({chapter.timestamp}s)</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {editingChapterId === chapter.id ? (
                <button
                  onClick={() =>
                    updateChapter(chapter.id, {
                      title: editedTitle,
                      timestamp: editedTimestamp,
                    })
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(chapter)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(chapter.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterList;
