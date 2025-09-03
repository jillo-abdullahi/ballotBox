import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  label?: string;
  required?: boolean;
}

export default function DatePicker({ value, onChange, min, label, required }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const minDate = min ? new Date(min) : new Date();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 380; // Approximate height of dropdown
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updateDropdownPosition);
    window.addEventListener('resize', updateDropdownPosition);
    
    updateDropdownPosition();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateSelect = (date: Date) => {
    // Create ISO string in local timezone to avoid timezone conversion issues
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const isoString = `${year}-${month}-${day}`;
    onChange(isoString);
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    return date < minDate;
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-xs text-neutral-400 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-blue-bg/50 border border-blue-bg/50 text-neutral-100 rounded-xl hover:bg-blue-bg/70 focus:bg-blue-bg/20 focus:ring-2 focus:ring-blue-text/20 focus:outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span className={selectedDate ? 'text-neutral-100' : 'text-neutral-400'}>
          {selectedDate ? formatDisplayDate(selectedDate) : 'Select date'}
        </span>
        <FaCalendarAlt className="w-4 h-4 text-neutral-400" />
      </button>

      {isOpen && (
        <div 
          className={`absolute left-0 right-0 mt-2 bg-blue-bg border-none rounded-xl shadow-xl z-50 p-3 backdrop-blur-xl ${
            dropdownPosition === 'top' ? 'bottom-full mb-2 mt-0' : 'top-full'
          }`}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1.5 hover:bg-blue-text/30 rounded-lg transition-colors cursor-pointer"
            >
              <FaChevronLeft className="w-5 h-5 text-neutral-300" />
            </button>
            
            <h3 className="text-neutral-100 font-medium text-sm">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1.5 hover:bg-blue-text/30 rounded-lg transition-colors cursor-pointer"
            >
              <FaChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs text-neutral-400 py-1.5 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={index} className="aspect-square" />;
              }

              const disabled = isDateDisabled(date);
              const selected = isDateSelected(date);
              const today = isToday(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !disabled && handleDateSelect(date)}
                  disabled={disabled}
                  className={`
                    aspect-square flex items-center justify-center text-xs rounded-md transition-all duration-200
                    ${disabled 
                      ? 'text-neutral-600 cursor-not-allowed' 
                      : 'text-neutral-200 hover:bg-blue-bg/30 hover:text-blue-text'
                    }
                    ${selected 
                      ? 'bg-blue-text/50 text-gray-900 font-semibold pointer-events-none' 
                      : ''
                    }
                    ${today && !selected 
                      ? 'ring-1 ring-blue-text/50' 
                      : ''
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
