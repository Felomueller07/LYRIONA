"use client";

import React, { useState, useEffect } from "react";
import { Download, CheckCircle, AlertCircle, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';

type GoogleCalendarEvent = {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  colorId?: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  category: string;
};

export type GoogleCalendarSyncProps = {
  onEventsImported: (events: Event[]) => void;
  className?: string;
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const CALENDAR_COLOR_MAP: { [key: string]: string } = {
  "SPG": "#10B981",
  "MKH": "#3B82F6",
  "BKU": "#FFD700",
  "Gipfelblech": "#8B0000",
  "BBÜ": "#8B5CF6",
  "various music": "#FF8C00",
  "Various Music": "#FF8C00",
  "Schule": "#4B5563",
  "schule": "#4B5563",
  default: "#EC4899",
};

const getCalendarColor = (calendarName: string): string => {
  for (const [key, color] of Object.entries(CALENDAR_COLOR_MAP)) {
    if (calendarName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return CALENDAR_COLOR_MAP.default;
};

export default function GoogleCalendarSync({ onEventsImported, className = "" }: GoogleCalendarSyncProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [autoImportAttempted, setAutoImportAttempted] = useState(false);

  useEffect(() => {
    const gsiScript = document.createElement("script");
    gsiScript.src = "https://accounts.google.com/gsi/client";
    gsiScript.async = true;
    gsiScript.defer = true;
    gsiScript.onload = () => initializeGoogleIdentity();
    gsiScript.onerror = () => {
      toast.error("Google API konnte nicht geladen werden");
      setStatus("error");
    };
    document.body.appendChild(gsiScript);

    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => {
      (window as any).gapi.load('client', () => {
        setGapiLoaded(true);
      });
    };
    document.body.appendChild(gapiScript);

    return () => {
      if (document.body.contains(gsiScript)) document.body.removeChild(gsiScript);
      if (document.body.contains(gapiScript)) document.body.removeChild(gapiScript);
    };
  }, []);

  useEffect(() => {
    if (tokenClient && gapiLoaded && !autoImportAttempted && GOOGLE_CLIENT_ID && GOOGLE_API_KEY) {
      if (typeof window !== 'undefined') {
        const savedTimestamp = localStorage.getItem('calendarEventsTimestamp');
        if (savedTimestamp) {
          const timestamp = parseInt(savedTimestamp);
          const now = Date.now();
          const daysSinceLastSync = (now - timestamp) / (1000 * 60 * 60 * 24);

          if (daysSinceLastSync < 7) {
            setAutoImportAttempted(true);
            setStatus("success");
            toast.success("Cache geladen - Daten sind aktuell");
            setTimeout(() => setStatus("idle"), 2000);
            return;
          }
        }
      }

      setAutoImportAttempted(true);
      setTimeout(() => handleSync(), 1000);
    }
  }, [tokenClient, gapiLoaded, autoImportAttempted]);

  const initializeGoogleIdentity = () => {
    try {
      if (typeof window !== "undefined" && (window as any).google) {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "") {
          toast.error("CLIENT_ID fehlt in .env.local");
          setStatus("error");
          return;
        }

        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: handleAuthResponse,
        });

        setTokenClient(client);
      }
    } catch (error) {
      toast.error("Initialisierungsfehler");
      setStatus("error");
    }
  };

  const handleAuthResponse = async (response: any) => {
    if (response.error) {
      toast.error(`Auth Fehler: ${response.error}`);
      setStatus("error");
      setIsLoading(false);
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    if (response.access_token) {
      setIsAuthorized(true);
      await fetchAllCalendarEvents(response.access_token);
    } else {
      toast.error("Authentifizierung fehlgeschlagen");
      setStatus("error");
      setIsLoading(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleSync = () => {
    if (!tokenClient) {
      toast.error("Google API nicht geladen");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    if (!gapiLoaded) {
      toast.error("API wird noch geladen...");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
      toast.error("API Keys fehlen in .env.local");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    toast.loading("Synchronisiere mit Google Calendar...", { id: 'sync' });

    try {
      tokenClient.requestAccessToken({ prompt: '' });
    } catch (error) {
      toast.error("Fehler bei der Authentifizierung", { id: 'sync' });
      setStatus("error");
      setIsLoading(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const fetchAllCalendarEvents = async (accessToken: string) => {
    try {
      setIsLoading(true);

      const timeMin = new Date();
      timeMin.setMonth(timeMin.getMonth() - 4);

      const timeMax = new Date();
      timeMax.setMonth(timeMax.getMonth() + 12);

      const calendarListResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${GOOGLE_API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!calendarListResponse.ok) {
        throw new Error("Fehler beim Laden der Kalenderliste");
      }

      const calendarListData = await calendarListResponse.json();
      const calendars = calendarListData.items || [];

      let allConvertedEvents: Event[] = [];

      for (const calendar of calendars) {
        try {
          const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?` +
            `timeMin=${timeMin.toISOString()}&` +
            `timeMax=${timeMax.toISOString()}&` +
            `maxResults=250&` +
            `singleEvents=true&` +
            `orderBy=startTime&` +
            `key=${GOOGLE_API_KEY}`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) continue;

          const data = await response.json();
          const googleEvents: GoogleCalendarEvent[] = data.items || [];

          const convertedEvents: Event[] = googleEvents
            .filter(event => event.start?.dateTime || event.start?.date)
            .map((event) => {
              const startDateTime = event.start.dateTime || event.start.date + "T00:00:00";
              const endDateTime = event.end?.dateTime || event.end?.date + "T23:59:59";

              const startDate = new Date(startDateTime);
              const endDate = new Date(endDateTime);

              const startHours = String(startDate.getHours()).padStart(2, '0');
              const startMinutes = String(startDate.getMinutes()).padStart(2, '0');
              const endHours = String(endDate.getHours()).padStart(2, '0');
              const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

              const year = startDate.getFullYear();
              const month = String(startDate.getMonth() + 1).padStart(2, '0');
              const day = String(startDate.getDate()).padStart(2, '0');
              const localDate = `${year}-${month}-${day}`;

              return {
                id: `google-${calendar.id}-${event.id}`,
                title: event.summary || "Kein Titel",
                date: localDate,
                startTime: `${startHours}:${startMinutes}`,
                endTime: `${endHours}:${endMinutes}`,
                color: getCalendarColor(calendar.summary || ""),
                category: calendar.summary || "Events",
              };
            });

          allConvertedEvents = [...allConvertedEvents, ...convertedEvents];
        } catch (calError) {
          console.error(`Fehler bei Kalender ${calendar.summary}:`, calError);
        }
      }

      onEventsImported(allConvertedEvents);
      setStatus("success");
      setMessage(`${allConvertedEvents.length} Termine importiert`);
      toast.success(`✅ ${allConvertedEvents.length} Termine synchronisiert`, { id: 'sync' });
      setIsLoading(false);

      setTimeout(() => setStatus("idle"), 4000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Import", { id: 'sync' });
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Fehler beim Import");
      setIsLoading(false);
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('calendarEvents');
    localStorage.removeItem('calendarEventsTimestamp');
    toast.success("Cache gelöscht");
    setTimeout(() => window.location.reload(), 1000);
  };

  // Cache Info
  const getCacheInfo = () => {
    if (typeof window === 'undefined') return null;
    const savedTimestamp = localStorage.getItem('calendarEventsTimestamp');
    const savedEvents = localStorage.getItem('calendarEvents');
    if (!savedTimestamp || !savedEvents) return null;

    const timestamp = parseInt(savedTimestamp);
    const now = Date.now();
    const daysSinceLastSync = (now - timestamp) / (1000 * 60 * 60 * 24);
    const eventCount = JSON.parse(savedEvents).length;

    return { daysSinceLastSync, eventCount };
  };

  const cacheInfo = getCacheInfo();

  return (
    <div className={className}>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          },
        }}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSync}
        disabled={isLoading}
        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl ${
          status === "success"
            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white"
            : status === "error"
              ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
              : "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-[#FFD700]/30"
        } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 size={18} className="animate-spin" />
              Synchronisiere...
            </motion.div>
          ) : status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <CheckCircle size={18} />
              {message}
            </motion.div>
          ) : status === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <AlertCircle size={18} />
              Fehler
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <RefreshCw size={18} />
              {autoImportAttempted ? "Erneut synchronisieren" : "Google Calendar Sync"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Cache Info */}
      {cacheInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Cache</span>
            <span className="text-[#FFD700] font-bold">
              {cacheInfo.eventCount} Events • {Math.round(cacheInfo.daysSinceLastSync * 10) / 10}d alt
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearCache}
            className="w-full py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-xl text-xs font-bold text-red-400 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Cache löschen & neu laden
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}