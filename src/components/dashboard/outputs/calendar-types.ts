export interface CalendarHeaderProps {
    currentDate: Date;
    monthNames: string[];        // ← ADD THIS
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onCreateEvent: () => void;
}