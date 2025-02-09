import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Chapter } from "./App";

interface UploadResponse {
  videoUrl: string;
  chapters: Chapter[];
}

interface VideoUploadFormProps {
  onUploadSuccess: (data: UploadResponse) => void;
}

const plantUnits = ["Unit 1", "Unit 2", "Unit 3"];
const assets = ["Asset A", "Asset B", "Asset C"];
const categories = ["Category 1", "Category 2", "Category 3"];

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState<string>("");
  const [plantUnit, setPlantUnit] = useState<string>("");
  const [asset, setAsset] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!title || !plantUnit || !asset || !category || !file) {
      setErrorMsg(
        "Please fill in all required fields and select a video file."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("plantUnit", plantUnit);
      formData.append("asset", asset);
      formData.append("category", category);
      formData.append("video", file);

      const response = await axios.post<UploadResponse>(
        "/api/upload", // adjust URL if necessary
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );
      onUploadSuccess(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Error uploading video. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xl"
    >
      <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Plant Unit *
        </label>
        <select
          value={plantUnit}
          onChange={(e) => setPlantUnit(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700"
          required
        >
          <option value="">Select Unit</option>
          {plantUnits.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Asset *
        </label>
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700"
          required
        >
          <option value="">Select Asset</option>
          {assets.map((ast, index) => (
            <option key={index} value={ast}>
              {ast}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow border rounded w-full py-2 px-3 text-gray-700"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Video File *
        </label>
        <input
          type="file"
          accept=".mp4,.mov,.avi"
          onChange={handleFileChange}
          required
        />
      </div>

      {uploadProgress > 0 && (
        <div className="mb-4">
          <progress value={uploadProgress} max={100} className="w-full" />
          <span>{uploadProgress}%</span>
        </div>
      )}

      {errorMsg && (
        <p className="text-red-500 text-xs italic mb-4">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload
      </button>
    </form>
  );
};

export default VideoUploadForm;
