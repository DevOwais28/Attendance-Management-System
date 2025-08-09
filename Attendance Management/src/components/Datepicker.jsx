"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

export function Datepicker({ value, isdisabled, onChangeDate, minDate }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(
    isValidDate(new Date(value)) ? new Date(value) : new Date()
  );
  const [month, setMonth] = React.useState(date);
  const [inputValue, setInputValue] = React.useState(formatDate(date));

  // ✅ Sync value from parent when it changes
  React.useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (isValidDate(parsedDate)) {
        setDate(parsedDate);
        setMonth(parsedDate);
        setInputValue(formatDate(parsedDate));
      }
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          disabled={isdisabled}
          onChange={(e) => {
            const newVal = e.target.value;
            setInputValue(newVal);
            const parsed = new Date(newVal);
            if (isValidDate(parsed)) {
              setDate(parsed);
              setMonth(parsed);
              if (onChangeDate) {
                const year = parsed.getFullYear();
                const month = String(parsed.getMonth() + 1).padStart(2, '0');
                const day = String(parsed.getDate()).padStart(2, '0');
                onChangeDate(`${year}-${month}-${day}`);
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              disabled={(date) => {
                if (minDate) {
                  const minDateObj = new Date(minDate);
                  minDateObj.setHours(0, 0, 0, 0);
                  return date < minDateObj;
                }
                return false;
              }}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setInputValue(formatDate(selectedDate));
                setOpen(false);
                if (onChangeDate && selectedDate) {
                  // Use local date to avoid timezone issues
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const day = String(selectedDate.getDate()).padStart(2, '0');
                  onChangeDate(`${year}-${month}-${day}`);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
