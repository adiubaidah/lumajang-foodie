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
        "flex items-center text-white px-2 py-1 rounded-md",
        "hover",
        !rate && "border-orange border-2 bg-orange/20"
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
          <span className="text-[12px] font-semibold leading-4 font-helvetica">
            4.0
          </span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Star width={17} height={17} fill="#F97300" />
          <span className="text-[12px] font-bold leading-4 font-helvetica text-orange">
            New
          </span>
        </React.Fragment>
      )}
    </Badge>
  );
}
