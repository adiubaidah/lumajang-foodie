import React from "react";
import { cn } from "~/lib/utils";
import { Star } from "~/icons";
import { rateColor } from "~/constant";
import { Badge } from "~/components/ui/badge";

interface BadgeRateProps {
  rate: number | null;
}

export function BadgeRate({ rate }: BadgeRateProps) {
  return (
    <Badge
      className={cn(
        "flex items-center gap-x-1 rounded-md px-2 py-1 text-white",
        !rate && "border-2 border-orange bg-orange/20",
      )}
      style={{
        backgroundColor: !!rate
          ? rateColor[Math.ceil(rate) - 1]
          : "transparent",
      }}
    >
      {!!rate ? (
        <React.Fragment>
          <Star width={17} height={17} fill="white" />
          <span className="font-helvetica text-[12px] font-semibold leading-4">
            {Math.ceil(rate).toFixed(1)}
          </span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Star width={17} height={17} fill="#F97300" />
          <span className="font-helvetica text-[12px] font-bold leading-4 text-orange">
            New
          </span>
        </React.Fragment>
      )}
    </Badge>
  );
}
