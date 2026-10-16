"use client";

import { Select } from "@base-ui/react/select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";

type Item = { value: string; label: string };

type Props = {
  id: string;
  /** Shown while nothing is chosen */
  placeholder?: string;
  /** Several can be chosen; the list stays open and each chosen option carries a check */
  multiple?: boolean;
  name: string;
  items: Item[];
  /** Uncontrolled starting value */
  defaultValue?: string | string[];
  /** Controlled value (with onValueChange) */
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

// A dropdown made to match the form's fields: the trigger is a field, the list is a rounded white panel that opens
// under it, the highlighted option is pale blue and the chosen one carries a check. Built on Base UI's Select, which
// brings the keyboard behaviour (arrows, type-ahead, Escape), the roles and the hidden input a form needs.
export function SelectField({ id, name, items, placeholder, multiple, defaultValue, value, onValueChange, required, ...aria }: Props) {
  const labels = new Map(items.map((item) => [item.value, item.label]));
  return (
    <Select.Root
      name={name}
      items={items}
      multiple={multiple}
      {...(value !== undefined ? { value } : { defaultValue: defaultValue ?? (multiple ? [] : undefined) })}
      onValueChange={(next) => onValueChange?.(Array.isArray(next) ? next.map(String) : String(next))}
      required={required}
    >
      <Select.Trigger id={id} {...aria} className="field group flex cursor-pointer items-center justify-between gap-3 text-left">
        <Select.Value placeholder={placeholder} className="min-w-0 truncate data-[placeholder]:text-muted">
          {(current: string | string[] | null) =>
            Array.isArray(current)
              ? current.length === 0
                ? placeholder
                : current.length > 2
                  ? `${current.length} selecionados`
                  : current.map((item) => labels.get(item) ?? item).join(", ")
              : current
                ? (labels.get(current) ?? current)
                : placeholder
          }
        </Select.Value>
        <Select.Icon className="text-navy transition-transform duration-200 ease-(--ease-out) group-data-[popup-open]:rotate-180">
          <CaretDownIcon aria-hidden="true" size={20} weight="bold" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={8} alignItemWithTrigger={false} className="z-[70] outline-none">
          <Select.Popup className="w-(--anchor-width) origin-(--transform-origin) rounded-[1.25rem] bg-white p-2 shadow-[0_20px_50px_rgb(26_54_93/0.2)] outline-none transition-[transform,opacity] duration-150 ease-(--ease-out) data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <Select.List className="max-h-72 overflow-y-auto">
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-[0.875rem] px-4 py-3 text-navy outline-none select-none data-[highlighted]:bg-[#e6eff7] data-[selected]:font-semibold"
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon aria-hidden="true" size={18} weight="bold" className="text-blue" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
