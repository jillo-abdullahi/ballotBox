import { useState, useRef, useEffect } from "react";
import { FaClock, FaChevronDown } from "react-icons/fa";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  required?: boolean;
}

export default function TimePicker({
  value,
  onChange,
  label,
  required,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [hours, setHours] = useState(
    value ? parseInt(value.split(":")[0]) : 12
  );
  const [minutes, setMinutes] = useState(
    value ? parseInt(value.split(":")[1]) : 0
  );
  const [period, setPeriod] = useState<"AM" | "PM">(
    value ? (parseInt(value.split(":")[0]) >= 12 ? "PM" : "AM") : "PM"
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplayTime = () => {
    if (!value) return "";
    const [h, m] = value.split(":");
    const hour12 =
      parseInt(h) === 0
        ? 12
        : parseInt(h) > 12
        ? parseInt(h) - 12
        : parseInt(h);
    const period = parseInt(h) >= 12 ? "PM" : "AM";
    return `${hour12}:${m} ${period}`;
  };

  const handleTimeChange = (
    newHours: number,
    newMinutes: number,
    newPeriod: "AM" | "PM"
  ) => {
    setHours(newHours);
    setMinutes(newMinutes);
    setPeriod(newPeriod);

    // Convert to 24-hour format for the value
    let hour24 = newHours;
    if (newPeriod === "PM" && newHours !== 12) {
      hour24 = newHours + 12;
    } else if (newPeriod === "AM" && newHours === 12) {
      hour24 = 0;
    }

    const timeString = `${hour24.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
    onChange(timeString);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs text-neutral-400 mb-2">
          {label} {required && "*"}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-blue-bg/50 border-none text-neutral-100 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span className={value ? "text-neutral-100" : "text-neutral-400"}>
          {value ? formatDisplayTime() : "Select time"}
        </span>
        <FaClock className="w-4 h-4 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-blue-bg border-none rounded-xl shadow-xl z-50 p-4 backdrop-blur-lg">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Hours */}
            <div className="flex flex-col">
              <label className="text-xs text-neutral-300 mb-2">Hour</label>
              <div className="relative">
                <select
                  value={hours}
                  onChange={(e) =>
                    handleTimeChange(parseInt(e.target.value), minutes, period)
                  }
                  className="cursor-pointer bg-blue-text/10 text-neutral-100 rounded-lg pl-3 pr-8 py-2 border-none focus:border-blue-text focus:outline-none appearance-none w-full"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-3 h-3 pointer-events-none" />
              </div>
            </div>

            <div className="text-neutral-400 text-xl font-bold mt-6">:</div>

            {/* Minutes */}
            <div className="flex flex-col">
              <label className="text-xs text-neutral-300 mb-2">Minute</label>
              <div className="relative">
                <select
                  value={minutes}
                  onChange={(e) =>
                    handleTimeChange(hours, parseInt(e.target.value), period)
                  }
                  className="cursor-pointer bg-blue-text/10 text-neutral-100 rounded-lg pl-3 pr-8 py-2 border-none focus:border-blue-text focus:outline-none appearance-none w-full"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-3 h-3 pointer-events-none" />
              </div>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col">
              <label className="text-xs text-neutral-300 mb-2">Period</label>
              <div className="flex bg-blue-text/10 rounded-lg border-none">
                <button
                  type="button"
                  onClick={() => handleTimeChange(hours, minutes, "AM")}
                  className={`cursor-pointer px-3 py-2 rounded-l-lg transition-colors ${
                    period === "AM"
                      ? "bg-blue-text text-gray-900"
                      : "text-neutral-300 hover:bg-gray-800"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange(hours, minutes, "PM")}
                  className={`cursor-pointer px-3 py-2 rounded-r-lg transition-colors ${
                    period === "PM"
                      ? "bg-blue-text text-gray-900"
                      : "text-neutral-300 hover:bg-gray-800"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
