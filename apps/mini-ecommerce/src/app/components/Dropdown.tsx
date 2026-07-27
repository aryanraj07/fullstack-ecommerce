"use client";
import React, { useEffect, useRef, useState } from "react";
import "@/styles/components/Product/Dropdown.css";

import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { DropdownOption } from "@/constants";

interface DropdownProps<T extends DropdownOption> {
  options: T[];
  placeholder: string;
  value: T["value"];
  onChange: (option: T) => void;
}
const Dropdown = <T extends DropdownOption>({
  options = [],
  placeholder = "Select option",
  value,
  onChange,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleSelect = (option: T) => {
    onChange(option);
    setOpen(false);
  };

  const seleectedLabel = options.find((p) => p.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown relative w-full sm:w-48" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm  bg-white flex items-center justify-between "
      >
        <span>{seleectedLabel || placeholder}</span>
        <span>
          <MdOutlineKeyboardArrowDown />
        </span>
        {/* Todo: Icon */}
      </button>
      {/* Dropdown Menu */}
      {open && (
        <ul
          className={`dropdown-menu absolute left-0 right-0 bg-white border mt-2 shadow-lg max-h-52 overflow-auto z-50 min-w-full animate-dropdown${
            open ? "show" : ""
          }`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-200 transition-all"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
