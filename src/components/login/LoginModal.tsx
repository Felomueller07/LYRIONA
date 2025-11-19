"use client";
import React from "react";
import type { Dispatch, SetStateAction } from "react";

type LoginMode = "none" | "admin" | "visitor";

type Props = {
  loginMode: LoginMode;
  setLoginMode: Dispatch<SetStateAction<LoginMode>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  onLogin: () => void;
  onClose: () => void;
};

export default function LoginModal({
  loginMode,
  setLoginMode,
  username,
  setUsername,
  password,
  setPassword,
  error,
  setError,
  onLogin,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-2xl w-[90%] max-w-sm border border-neutral-800">
        <h2 className="text-2xl font-semibold text-center mb-6">Anmeldung</h2>

        {loginMode === "none" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setLoginMode("admin")}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-gray-100"
            >
              Als Administrator
            </button>

            <button
              onClick={() => {
                setLoginMode("visitor");
                onLogin();
              }}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-gray-100"
            >
              Als Besucher
            </button>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 mt-3 text-sm"
            >
              Abbrechen
            </button>
          </div>
        )}

        {loginMode === "admin" && (
          <div
            onKeyDown={(e) => {
              if (e.key === "Enter") onLogin();
            }}
          >
            <input
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-neutral-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            {error && (
              <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => setLoginMode("none")}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-gray-300"
              >
                Zurück
              </button>
              <button
                onClick={onLogin}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition"
              >
                Weiter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
