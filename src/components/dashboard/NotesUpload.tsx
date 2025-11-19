"use client";

import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";

type Props = {
  role: string;
};

export default function NotesUpload({ role }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<
    Array<{
      name: string;
      originalName: string;
      pages: number;
      bmpData: string[];
      timestamp: number;
    }>
  >([]);
  const [isConverting, setIsConverting] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const pdfFiles = selected.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length !== selected.length) {
      alert("Bitte nur PDF-Dateien hochladen!");
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const pdfFiles = dropped.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length !== dropped.length) {
      alert("Bitte nur PDF-Dateien hochladen!");
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
  }

  function preventDefault(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  async function convertPDFtoBMP(file: File) {
    setIsConverting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulierte BMP Daten (in echter Implementation würde hier die Konvertierung stattfinden)
      const mockBMPData = Array.from(
        { length: 1 },
        (_, i) =>
          `BM Header - Konvertiert von ${file.name} - Seite ${i + 1}\n[Binary BMP Data]`
      );

      const converted = {
        name: file.name.replace(".pdf", ".bmp"),
        originalName: file.name,
        pages: 1,
        bmpData: mockBMPData,
        timestamp: Date.now(),
      };

      setConvertedFiles((prev) => [...prev, converted]);
    } catch (error) {
      console.error("Fehler bei der Konvertierung:", error);
      alert("Fehler bei der PDF-Konvertierung!");
    } finally {
      setIsConverting(false);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeConvertedFile(index: number) {
    setConvertedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <FileText className="text-purple-400" />
          Meine Noten
        </h2>
        <p className="text-gray-400">
          {role === "visitor"
            ? "👁️ Besucheransicht - du kannst nur anschauen"
            : "Lade PDF-Dateien hoch und konvertiere sie zu BMP für dein E-Paper Display"}
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={preventDefault}
        className="relative border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-3xl p-12 text-center transition-all group bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
            <Upload size={32} className="text-purple-400" />
          </div>

          {role === "visitor" ? (
            <div>
              <p className="text-gray-300 mb-2">👁️ Besucheransicht</p>
              <p className="text-gray-500 text-sm">
                Du kannst Dateien sehen, aber nicht hochladen.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 mb-3 text-lg">
                Ziehe deine PDF-Dateien hierher
              </p>
              <p className="text-gray-500 mb-6">oder</p>
              <label className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold cursor-pointer hover:scale-105 transition-transform">
                PDF auswählen
                <input
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-xs text-gray-500 mt-3">
                Nur PDF-Dateien werden akzeptiert
              </p>
            </div>
          )}

          {/* Uploaded PDFs */}
          {files.length > 0 && role === "admin" && (
            <div className="mt-8 space-y-3">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xs">
                      PDF
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium block truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => convertPDFtoBMP(file)}
                      disabled={isConverting}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all hover:scale-105"
                    >
                      {isConverting ? "Konvertiere..." : "Zu BMP"}
                    </button>
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Converted BMP Files */}
      {convertedFiles.length > 0 && role === "admin" && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Konvertierte BMP-Dateien
          </h3>
          <div className="space-y-3">
            {convertedFiles.map((file, idx) => (
              <div
                key={idx}
                className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                      BMP
                    </div>
                    <div>
                      <h4 className="font-semibold">{file.name}</h4>
                      <p className="text-xs text-gray-400">
                        Von: {file.originalName} • {file.pages} Seite(n)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeConvertedFile(idx)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                    An ESP senden
                  </button>
                  <button
                    onClick={() => {
                      // Download BMP
                      const blob = new Blob([file.bmpData[0]], {
                        type: "image/bmp",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = file.name;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all hover:scale-105"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}