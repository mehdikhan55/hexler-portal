"use client";

import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  showTimeSelect?: boolean; // Optional prop for selecting time
  dateFormat?: string; // Optional prop for custom date format
  id?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  showTimeSelect = false,
  dateFormat = "dd/MM/yyyy", // Default format to dd/MM/yyyy
  id = "custom-date-picker"
}) => {
  return (
    <ReactDatePicker
      id={id}
      selected={selectedDate}
      onChange={onDateChange}
      showTimeSelect={showTimeSelect}
      dateFormat={dateFormat}
      wrapperClassName="date-picker"
      className="bg-[#212529] border border-dark-500 py-[3.2px] mt-1 rounded-md text-white "
    />
  );
};

export default DatePicker;
