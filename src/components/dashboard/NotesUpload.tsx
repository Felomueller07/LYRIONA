"use client";

import React, { useState } from "react";
import { Upload, FileText, X, Download, Wifi } from "lucide-react";

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
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={preventDefault}
        className="relative border-2 border-dashed border-white/20 hover:border-[#FFD700]/50 rounded-2xl p-16 text-center transition-all group bg-white/5 backdrop-blur-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 group-hover:bg-gradient-to-br group-hover:from-[#FFD700]/20 group-hover:to-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6 transition-all">
            <Upload size={28} className="text-gray-400 group-hover:text-[#FFD700] transition-colors" />
          </div>

          {role === "visitor" ? (
            <div>
              <p className="text-gray-300 text-lg mb-2">👁️ Besucheransicht</p>
              <p className="text-gray-500">
                Du kannst Dateien sehen, aber nicht hochladen.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-white text-xl font-semibold mb-3">
                Ziehe deine PDF-Dateien hierher
              </p>
              <p className="text-gray-500 mb-6">oder</p>
              <label className="inline-block px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#FFD700] text-black font-semibold rounded-xl cursor-pointer hover:scale-105 transition-all shadow-lg shadow-[#FFD700]/20">
                PDF auswählen
                <input
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="text-xs text-gray-500 mt-4">
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
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      PDF
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium block truncate text-white">
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
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-lg"
                    >
                      {isConverting ? "Konvertiere..." : "Zu BMP"}
                    </button>
                    <button
                      onClick={() => removeFile(idx)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                    >
                      <X size={18} className="text-red-400 group-hover:text-red-300" />
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
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Konvertierte BMP-Dateien
          </h3>
          <div className="space-y-4">
            {convertedFiles.map((file, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/[0.07] hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-xs shadow-xl">
                      BMP
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{file.name}</h4>
                      <p className="text-sm text-gray-400">
                        Von: {file.originalName} • {file.pages} Seite(n)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeConvertedFile(idx)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                  >
                    <X size={20} className="text-red-400 group-hover:text-red-300" />
                  </button>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                    <Wifi size={18} />
                    An ESP senden
                  </button>
                  <button
                    onClick={() => {
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
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box wenn keine Dateien */}
      {files.length === 0 && convertedFiles.length === 0 && role === "admin" && (
        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <p className="text-blue-300 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Lade PDF-Dateien hoch um sie für dein E-Paper Display zu konvertieren
          </p>
        </div>
      )}
    </div>
  );
}