import { useEffect, useRef, useState } from 'react';

const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'S'];

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function Calendar({
  value,
  onSelect,
  onClose,
}: {
  value?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const initialDate = value ?? new Date();

  const [current, setCurrent] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  const year = current.getFullYear();
  const month = current.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDayIndex = (current.getDay() + 6) % 7;

  const selected = value ?? null;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={ref} className="w-64">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrent(new Date(year, month - 1, 1))}>{'<'}</button>

        <p className="font-semibold">
          {current.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <button onClick={() => setCurrent(new Date(year, month + 1, 1))}>{'>'}</button>
      </div>

      <div className="grid grid-cols-7 text-center text-gray-500 mb-2">
        {days.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const isSelected = selected && date.toDateString() === selected.toDateString();

          return (
            <button
              key={day}
              onClick={() => onSelect(date)}
              className={`w-8 h-8 rounded-full hover:bg-blue-100 ${
                isSelected ? 'border-2 border-blue-500 text-blue-600' : ''
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
