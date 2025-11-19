export interface CalendarHeaderProps {
    currentDate: Date;
    monthNames: string[];        // ← ADD THIS
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onCreateEvent: () => void;
}

export interface CalendarSidebarProps {
    currentDate: Date;
    monthNames: string[];        // ← ADD THIS
    weekDays: string[];
    categories: string[];
    showAllCategories: boolean;
    setShowAllCategories: (value: boolean) => void;
    onMonthChange: (direction: number) => void;
    onEventsImported: () => void;
    role?: "admin" | "user";
}