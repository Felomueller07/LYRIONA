"use client";

import React, {useState, useEffect} from "react";
import {Download, CheckCircle, AlertCircle, Loader2} from "lucide-react";

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

const COLOR_MAP: { [key: string]: string } = {
    "1": "#8B5CF6",
    "2": "#10B981",
    "3": "#8B5CF6",
    "4": "#EF4444",
    "5": "#F59E0B",
    "6": "#F59E0B",
    "7": "#3B82F6",
    "8": "#6B7280",
    "9": "#3B82F6",
    "10": "#10B981",
    "11": "#EF4444",
    default: "#8B5CF6",
};

// Kalender-Name zu Farbe Mapping
const CALENDAR_COLOR_MAP: { [key: string]: string } = {
    "SPG": "#10B981", // Grün
    "MKH": "#3B82F6", // Blau
    "BKU": "#FFD700", // Gold/Gelb
    "Gipfelblech": "#8B0000", // Dunkelrot
    "BBÜ": "#8B5CF6", // Violett
    "various music": "#FF8C00", // Orange
    "Various Music": "#FF8C00", // Orange (falls groß geschrieben)
    "Schule": "#4B5563", // Dunkelgrau
    "schule": "#4B5563", // Dunkelgrau (klein geschrieben)
    default: "#EC4899", // Pink als Standardfarbe für andere
};

// Hilfsfunktion um Kalenderfarbe zu bestimmen
const getCalendarColor = (calendarName: string): string => {
    // Prüfe ob der Kalendername einen der Keys enthält
    for (const [key, color] of Object.entries(CALENDAR_COLOR_MAP)) {
        if (calendarName.toLowerCase().includes(key.toLowerCase())) {
            return color;
        }
    }
    return CALENDAR_COLOR_MAP.default;
};

export default function GoogleCalendarSync({onEventsImported, className = ""}: GoogleCalendarSyncProps) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [tokenClient, setTokenClient] = useState<any>(null);
    const [gapiLoaded, setGapiLoaded] = useState(false);
    const [autoImportAttempted, setAutoImportAttempted] = useState(false);

    useEffect(() => {
        console.log("🔄 Lade Google API Scripts...");

        const gsiScript = document.createElement("script");
        gsiScript.src = "https://accounts.google.com/gsi/client";
        gsiScript.async = true;
        gsiScript.defer = true;
        gsiScript.onload = () => {
            console.log("✅ Google Identity Services geladen");
            initializeGoogleIdentity();
        };
        gsiScript.onerror = () => {
            console.error("❌ Fehler beim Laden von Google Identity Services");
            setStatus("error");
            setMessage("API konnte nicht geladen werden");
        };
        document.body.appendChild(gsiScript);

        const gapiScript = document.createElement("script");
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.async = true;
        gapiScript.defer = true;
        gapiScript.onload = () => {
            console.log("✅ Google API Client geladen");
            (window as any).gapi.load('client', () => {
                console.log("✅ GAPI Client initialisiert");
                setGapiLoaded(true);
            });
        };
        gapiScript.onerror = () => {
            console.error("❌ Fehler beim Laden von Google API Client");
        };
        document.body.appendChild(gapiScript);

        return () => {
            if (document.body.contains(gsiScript)) document.body.removeChild(gsiScript);
            if (document.body.contains(gapiScript)) document.body.removeChild(gapiScript);
        };
    }, []);

    // Automatischer Import beim Start
    useEffect(() => {
        if (tokenClient && gapiLoaded && !autoImportAttempted && GOOGLE_CLIENT_ID && GOOGLE_API_KEY) {
            // Prüfe ob bereits frische Daten im Cache sind
            if (typeof window !== 'undefined') {
                const savedTimestamp = localStorage.getItem('calendarEventsTimestamp');
                if (savedTimestamp) {
                    const timestamp = parseInt(savedTimestamp);
                    const now = Date.now();
                    const daysSinceLastSync = (now - timestamp) / (1000 * 60 * 60 * 24);

                    // Wenn letzter Sync weniger als 7 Tage her ist, überspringe Auto-Import
                    if (daysSinceLastSync < 7) {
                        console.log(`✅ Cache ist frisch (${Math.round(daysSinceLastSync)} Tage alt) - überspringe Auto-Import`);
                        setAutoImportAttempted(true);
                        setStatus("success");
                        setMessage("Cache geladen");
                        setTimeout(() => setStatus("idle"), 2000);
                        return;
                    }
                }
            }

            console.log("🚀 Starte automatischen Import beim Laden...");
            setAutoImportAttempted(true);

            // Kleine Verzögerung damit UI laden kann
            setTimeout(() => {
                handleSync();
            }, 1000);
        }
    }, [tokenClient, gapiLoaded, autoImportAttempted]);

    const initializeGoogleIdentity = () => {
        try {
            if (typeof window !== "undefined" && (window as any).google) {
                console.log("🔧 Initialisiere Google OAuth Client...");

                if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "") {
                    console.error("❌ CLIENT_ID nicht konfiguriert!");
                    setStatus("error");
                    setMessage("CLIENT_ID fehlt in .env.local");
                    return;
                }

                const client = (window as any).google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: SCOPES,
                    callback: handleAuthResponse,
                });

                setTokenClient(client);
                console.log("✅ OAuth Client initialisiert");
            }
        } catch (error) {
            console.error("❌ Fehler bei der Initialisierung:", error);
            setStatus("error");
            setMessage("Initialisierungsfehler");
        }
    };

    const handleAuthResponse = async (response: any) => {
        console.log("🔐 Auth Response erhalten");

        if (response.error) {
            console.error("❌ Auth Fehler:", response.error);
            setStatus("error");
            setMessage(`Auth Fehler: ${response.error}`);
            setIsLoading(false);
            setTimeout(() => setStatus("idle"), 4000);
            return;
        }

        if (response.access_token) {
            console.log("✅ Access Token erhalten");
            setIsAuthorized(true);
            await fetchAllCalendarEvents(response.access_token);
        } else {
            console.error("❌ Kein Access Token erhalten");
            setStatus("error");
            setMessage("Authentifizierung fehlgeschlagen");
            setIsLoading(false);
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleSync = () => {
        console.log("🔘 Sync Button geklickt");

        if (!tokenClient) {
            console.error("❌ Token Client nicht initialisiert");
            setStatus("error");
            setMessage("Google API nicht geladen. Seite neu laden?");
            setTimeout(() => setStatus("idle"), 4000);
            return;
        }

        if (!gapiLoaded) {
            console.error("❌ GAPI nicht geladen");
            setStatus("error");
            setMessage("API wird noch geladen...");
            setTimeout(() => setStatus("idle"), 3000);
            return;
        }

        if (!GOOGLE_CLIENT_ID || !GOOGLE_API_KEY) {
            console.error("❌ Credentials nicht konfiguriert");
            setStatus("error");
            setMessage("API Keys fehlen in .env.local");
            setTimeout(() => setStatus("idle"), 4000);
            return;
        }

        console.log("🚀 Starte Authentifizierung...");
        setIsLoading(true);
        setStatus("idle");

        try {
            tokenClient.requestAccessToken({prompt: ''});
        } catch (error) {
            console.error("❌ Fehler beim Anfordern des Tokens:", error);
            setStatus("error");
            setMessage("Fehler bei der Authentifizierung");
            setIsLoading(false);
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const fetchAllCalendarEvents = async (accessToken: string) => {
        try {
            console.log("📅 Lade ALLE Kalender...");
            setIsLoading(true);

            const timeMin = new Date();
            timeMin.setMonth(timeMin.getMonth() - 4); // 4 Monate in die Vergangenheit

            const timeMax = new Date();
            timeMax.setMonth(timeMax.getMonth() + 12); // 12 Monate in die Zukunft

            console.log("📊 Zeitraum:", timeMin.toLocaleDateString(), "bis", timeMax.toLocaleDateString());

            // SCHRITT 1: Lade alle Kalender des Users
            console.log("🔍 Lade Kalenderliste...");
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

            console.log(`📚 ${calendars.length} Kalender gefunden:`, calendars.map((c: any) => c.summary));

            // SCHRITT 2: Lade Events aus ALLEN Kalendern parallel
            let allConvertedEvents: Event[] = [];

            for (const calendar of calendars) {
                try {
                    console.log(`📥 Lade Events aus: ${calendar.summary}`);

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

                    if (!response.ok) {
                        console.warn(`⚠️ Fehler bei Kalender ${calendar.summary}, überspringe...`);
                        continue;
                    }

                    const data = await response.json();
                    const googleEvents: GoogleCalendarEvent[] = data.items || [];

                    console.log(`  ✅ ${googleEvents.length} Events aus "${calendar.summary}"`);

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
                    console.error(`❌ Fehler bei Kalender ${calendar.summary}:`, calError);
                }
            }

            console.log(`✅ GESAMT: ${allConvertedEvents.length} Events aus allen Kalendern`);
            console.log("📋 Termine:", allConvertedEvents.slice(0, 5).map(e => `${e.date}: ${e.title}`));

            onEventsImported(allConvertedEvents);
            setStatus("success");
            setMessage(`${allConvertedEvents.length} Termine importiert`);
            setIsLoading(false);

            setTimeout(() => setStatus("idle"), 4000);
        } catch (error) {
            console.error("❌ Fehler beim Abrufen der Events:", error);
            setStatus("error");
            setMessage(error instanceof Error ? error.message : "Fehler beim Import");
            setIsLoading(false);
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <div className={className}>
            <button
                onClick={handleSync}
                disabled={isLoading}
                className={`w-full py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg ${
                    status === "success"
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        : status === "error"
                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                            : "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFA500] text-black"
                } ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin"/>
                        Synchronisiere...
                    </>
                ) : status === "success" ? (
                    <>
                        <CheckCircle size={18}/>
                        {message}
                    </>
                ) : status === "error" ? (
                    <>
                        <AlertCircle size={18}/>
                        {message}
                    </>
                ) : (
                    <>
                        <Download size={18}/>
                        {autoImportAttempted ? "Erneut synchronisieren" : "Sync mit Google Calendar"}
                    </>
                )}
            </button>

            {message && (
                <p className={`mt-2 text-xs text-center ${
                    status === "success" ? "text-green-400" :
                        status === "error" ? "text-red-400" :
                            "text-gray-400"
                }`}>
                    {message}
                </p>
            )}

            {/* Cache Info */}
            {typeof window !== 'undefined' && (() => {
                const savedTimestamp = localStorage.getItem('calendarEventsTimestamp');
                const savedEvents = localStorage.getItem('calendarEvents');
                if (savedTimestamp && savedEvents) {
                    const timestamp = parseInt(savedTimestamp);
                    const now = Date.now();
                    const daysSinceLastSync = (now - timestamp) / (1000 * 60 * 60 * 24);
                    const eventCount = JSON.parse(savedEvents).length;

                    return (
                        <div className="mt-3 text-xs text-center space-y-2">
                            <p className="text-[#C0C0C0]">
                                💾 {eventCount} Termine im Cache ({Math.round(daysSinceLastSync * 10) / 10} Tage alt)
                            </p>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('calendarEvents');
                                    localStorage.removeItem('calendarEventsTimestamp');
                                    setMessage("Cache gelöscht!");
                                    setStatus("success");
                                    setTimeout(() => {
                                        setStatus("idle");
                                        setMessage("");
                                        window.location.reload();
                                    }, 1500);
                                }}
                                className="text-[#D4AF37] hover:text-[#FFD700] underline"
                            >
                                Cache löschen & neu laden
                            </button>
                        </div>
                    );
                }
                return null;
            })()}
        </div>
    );
}