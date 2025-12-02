// calendar-types.ts - All TypeScript types for the calendar

export type Event = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  category: string;
};

export type Category = {
  name: string;
  color: string;
  enabled: boolean;
};

export type CalendarProps = {
  role?: "admin" | "visitor";
};

export type CalendarHeaderProps = {
  currentDate: Date;
  monthNames: string[];
  view: "week" | "month";
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCreateEvent: () => void;
  onToggleView: () => void;
  role?: "admin" | "visitor";
};

export type CalendarSidebarProps = {
  currentDate: Date;
  monthNames: string[];
  weekDays: string[];
  categories: Category[];
  showAllCategories: boolean;
  setShowAllCategories: (show: boolean) => void;
  onMonthChange: (increment: number) => void;
  onEventsImported: (events: Event[]) => void;
  role?: "admin" | "visitor";
  events?: Event[];
};

export type CalendarWeekViewProps = {
  weekDates: Date[];
  weekDays: string[];
  hours: number[];
  events: Event[];
  onEventClick: (event: Event) => void;
};

export type EventDetailModalProps = {
  event: Event | null;
  categories: Category[];
  isEditing: boolean;
  editedEvent: Event | null;
  onClose: () => void;
  onEdit: () => void;
  onSave: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onCancelEdit: () => void;
  onEditChange: (event: Event | null) => void;
  role?: "admin" | "visitor";
};

export type CreateEventModalProps = {
  show: boolean;
  categories: Category[];
  newEvent: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    category: string;
  };
  onChange: (event: any) => void;
  onCreate: () => void;
  onClose: () => void;
};