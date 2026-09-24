import { Listbox } from '@headlessui/react';
import { FiChevronDown } from 'react-icons/fi';
import React from "react";

interface DropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    label?: string; // <-- Add label prop
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, className, label }) => (
  <div className={`relative ${className || ''}`}>
    <div className="flex items-center">
      {label && (
        <span className="font-formular-black font-bold mr-2 hidden lg:inline">
            {label}
            <span style={{ fontFamily: 'Arial, sans-serif' }}>:</span>
        </span>
        )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full">
          <Listbox.Button className="font-formular-mono border border-mainmaroon rounded-xl px-6 py-2 w-full flex items-center justify-between focus:outline-none text-sm lg:text-md">
            <span className="truncate min-w-0">{value}</span>
            <FiChevronDown className="w-4 h-4 ml-2 text-mainmaroon" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 w-full min-w-[120px] bg-white border border-mainmaroon rounded-md shadow-lg focus:outline-none text-sm lg:text-md">
            {options.map((option) => (
              <Listbox.Option
                key={option}
                value={option}
                className={({ active, selected }) =>
                  `group cursor-pointer select-none px-6 py-2 flex items-center justify-between
                  ${active ? 'bg-mainmaroon/10' : ''}
                  ${selected ? 'font-bold text-mainmaroon' : ''}`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className="font-formular-mono">{option}</span>
                    <span
                      className={`
                        ml-2 w-4 h-4 border border-mainmaroon rounded-xs flex items-center justify-center
                        ${active ? 'bg-mainmaroon/20' : ''}
                        flex-shrink-0 hidden lg:flex
                      `}
                    >
                      {selected && (
                        <span className={`w-full h-full ${selected ? 'bg-mainmaroon' : ''} rounded-xs`} />
                      )}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  </div>
);

export default Dropdown;