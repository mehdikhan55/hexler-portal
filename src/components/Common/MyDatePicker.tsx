import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  label?: string;
  id?: string;
  placeholder?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const MyDatePicker = ({
  selectedDate,
  onDateChange,
  label,
  id = "datepicker",
  placeholder = "Pick a date",
  dateFormat = "PPP",
  minDate,
  maxDate,
  disabled = false,
  className,
  required = false,
}: DatePickerProps) => {
  return (
    <div className={cn("grid w-full gap-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium leading-none">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id={id}
              type="text"
              readOnly
              value={selectedDate ? format(selectedDate, dateFormat) : ""}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className="pl-3 pr-10"
            />
            <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            //@ts-ignore
            onSelect={onDateChange}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
          />
          {selectedDate && (
            <div className="flex items-center justify-center border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(null)}
                className="text-xs"
              >
                Clear date
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MyDatePicker;