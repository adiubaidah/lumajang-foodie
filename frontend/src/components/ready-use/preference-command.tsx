"use client";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import { axiosInstance } from "~/lib/utils";
import { PlacePreference } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { usePlacePreference } from "~/hooks";

interface PreferenceCommandProps {
  values: PlacePreference[];
  setValues: Dispatch<SetStateAction<PlacePreference[]>>;
}

export function PreferenceCommand({
  values,
  setValues,
}: PreferenceCommandProps) {
  const preferences = usePlacePreference();

  const handleCheckboxChange = (id: string) => {
    const isSelected = values.some((preference) => preference.id === id);
    if (isSelected) {
      // Preference is selected, remove it
      setValues(values.filter((preference) => preference.id !== id));
    } else {
      // Preference is not selected, add it
      const findData = preferences?.find((preference) => preference.id === id);
      if (findData) {
        setValues([...values, findData]);
      }
    }
  };

  const preferenceIds = new Set(values.map((pfc) => pfc.id));

  return (
    preferences && (
      <Command>
        <CommandInput placeholder="Cari preferensi" />
        <CommandList className="h-[300px]">
          {preferences.map((preference) => (
            <CommandItem
              key={preference.id}
              keywords={[preference.label]}
              value={preference.id}
              className="flex items-center space-x-3"
            >
              <Checkbox
                checked={preferenceIds.has(preference.id)}
                onCheckedChange={() => handleCheckboxChange(preference.id)}
              />
              <label>{preference.label}</label>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    )
  );
}
