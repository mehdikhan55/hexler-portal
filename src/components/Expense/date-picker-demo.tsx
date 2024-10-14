"use client";

import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  showTimeSelect?: boolean; // Optional prop for selecting time
  dateFormat?: string; // Optional prop for custom date format
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  showTimeSelect = false,
  dateFormat = "dd/MM/yyyy", // Default format to dd/MM/yyyy
}) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onDateChange}
      showTimeSelect={showTimeSelect}
      dateFormat={dateFormat}
      wrapperClassName="date-picker"
    />
  );
};

export default DatePicker;
