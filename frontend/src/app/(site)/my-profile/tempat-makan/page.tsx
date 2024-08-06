"use client"
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "~/hooks";
import Loader from "~/components/ready-use/loader";
import SkeletonImage from "~/components/ready-use/skeleton-image";

export default function TempatMakanPage() {
    const { user } = useAuth();
  return (
    <div>
      <h1>Tempat Makan</h1>
    </div>
  );
}