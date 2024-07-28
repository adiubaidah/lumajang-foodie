import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

type OpeningHourProps = {
  index: number;
  form: any;
};

const OpeningHour = ({ index, form }: OpeningHourProps) => {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);

  useEffect(() => {
    if (!isSwitchEnabled) {
      form.setValue(`openingHours.${index}.openTime`, null);
      form.setValue(`openingHours.${index}.closeTime`, null);
    }
  }, [isSwitchEnabled, form, index]);

  const handleSwitchChange = () => {
    setIsSwitchEnabled(!isSwitchEnabled);
  };

  return (
    <div className="mt-4 flex items-center">
      <input
        {...form.register(`openingHours.${index}.day`)}
        className="bg-transparent focus:outline-none"
        readOnly
      />
      <div className="md:2/3 flex w-1/3 space-x-3">
        <Input
          {...form.register(`openingHours.${index}.openTime`, {
            required: false,
          })}
          placeholder="Jam Buka"
          type="time"
          required={isSwitchEnabled}
          readOnly={!isSwitchEnabled}
          value={!isSwitchEnabled ? undefined : "07:00"}
        />
        <Input
          {...form.register(`openingHours.${index}.closeTime`, {
            required: false,
          })}
          type="time"
          required={isSwitchEnabled}
          placeholder="Jam tutup"
          readOnly={!isSwitchEnabled}
          value={!isSwitchEnabled ? undefined : "20:00"}
        />
      </div>
      <Switch
        checked={isSwitchEnabled}
        className="ml-2"
        onCheckedChange={handleSwitchChange}
      />
    </div>
  );
};

export default OpeningHour;
