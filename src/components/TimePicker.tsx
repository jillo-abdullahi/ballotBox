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
  const [hoursDropdownOpen, setHoursDropdownOpen] = useState(false);
  const [minutesDropdownOpen, setMinutesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  const [hours, setHours] = useState(() => {
    if (!value) return 12;
    const hour24 = parseInt(value.split(":")[0]);
    return hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  });
  const [minutes, setMinutes] = useState(() => {
    if (!value) return 0;
    return parseInt(value.split(":")[1]);
  });
  const [period, setPeriod] = useState<"AM" | "PM">(() => {
    if (!value) return "AM";
    const hour24 = parseInt(value.split(":")[0]);
    return hour24 >= 12 ? "PM" : "AM";
  });

  // Sync internal state when value prop changes
  useEffect(() => {
    if (value) {
      const hour24 = parseInt(value.split(":")[0]);
      const minute = parseInt(value.split(":")[1]);
      
      setHours(hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24);
      setMinutes(minute);
      setPeriod(hour24 >= 12 ? "PM" : "AM");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        hoursRef.current &&
        !hoursRef.current.contains(event.target as Node)
      ) {
        setHoursDropdownOpen(false);
      }
      if (
        minutesRef.current &&
        !minutesRef.current.contains(event.target as Node)
      ) {
        setMinutesDropdownOpen(false);
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
        className="w-full px-5 py-4 bg-blue-bg/50 border border-blue-bg/50 text-neutral-100 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 flex items-center justify-between"
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
            <div className="flex flex-col relative" ref={hoursRef}>
              <label className="text-xs text-neutral-300 mb-2">Hour</label>
              
              {hoursDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-blue-bg border border-blue-text/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-blue-bg scrollbar-thumb-blue-text/30 hover:scrollbar-thumb-blue-text/50">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => {
                        handleTimeChange(hour, minutes, period);
                        setHoursDropdownOpen(false);
                      }}
                      className={`cursor-pointer w-full px-3 py-3 text-left hover:bg-blue-text/20 transition-colors border-b border-blue-text/10 last:border-b-0 ${
                        hours === hour ? 'bg-blue-text/30 text-blue-text' : 'text-neutral-100'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setHoursDropdownOpen(!hoursDropdownOpen)}
                className="bg-blue-text/10 cursor-pointer text-neutral-100 rounded-lg pl-3 pr-4 py-2 border-none focus:border-blue-text focus:outline-none w-full text-left flex items-center justify-between hover:bg-blue-text/20 transition-colors"
              >
                <span>{hours}</span>
                <FaChevronDown className={`text-neutral-400 w-3 h-3 ml-4 transition-transform ${hoursDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="text-neutral-400 text-xl font-bold mt-6">:</div>

            {/* Minutes */}
            <div className="flex flex-col relative" ref={minutesRef}>
              <label className="text-xs text-neutral-300 mb-2">Minute</label>
              
              {minutesDropdownOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-blue-bg border border-blue-text/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-blue-bg scrollbar-thumb-blue-text/30 hover:scrollbar-thumb-blue-text/50">
                  {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => {
                        handleTimeChange(hours, minute, period);
                        setMinutesDropdownOpen(false);
                      }}
                      className={`cursor-pointer w-full px-3 py-3 text-left hover:bg-blue-text/20 transition-colors border-b border-blue-text/10 last:border-b-0 ${
                        minutes === minute ? 'bg-blue-text/30 text-blue-text' : 'text-neutral-100'
                      }`}
                    >
                      {minute.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setMinutesDropdownOpen(!minutesDropdownOpen)}
                className="cursor-pointer bg-blue-text/10 text-neutral-100 rounded-lg pl-3 pr-4 py-2 border-none focus:border-blue-text focus:outline-none w-full text-left flex items-center justify-between hover:bg-blue-text/20 transition-colors"
              >
                <span>{minutes.toString().padStart(2, "0")}</span>
                <FaChevronDown className={`text-neutral-400 w-3 h-3 ml-4 transition-transform ${minutesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
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
