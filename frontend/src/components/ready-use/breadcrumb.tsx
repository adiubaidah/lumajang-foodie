"use client";
import React from "react";
import { Slash } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments: string[] = pathname.split("/").filter((segment) => segment !== "");
  return (
    <BreadcrumbComponent className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        {segments.map((segment, index) => (
          <React.Fragment key={"breadcrumb" + index}>
            <BreadcrumbItem >
              <BreadcrumbLink
                href={`/${segments.slice(0, index + 1).join("/")}`}
                className="capitalize"
              >
                {segment.replace(/-/g, ' ')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== segments.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};

export default Breadcrumb;
