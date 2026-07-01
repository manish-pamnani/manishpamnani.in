import Image from "next/image";
import { site } from "@/lib/site";

const sizes = {
  sm: { box: "h-10 w-10", image: 40, ring: "ring-1" },
  md: { box: "h-14 w-14", image: 56, ring: "ring-2" },
  lg: { box: "h-28 w-28 sm:h-32 sm:w-32", image: 128, ring: "ring-2" },
} as const;

type SiteLogoProps = {
  size?: keyof typeof sizes;
  className?: string;
};

export function SiteLogo({ size = "md", className = "" }: SiteLogoProps) {
  const { box, image, ring } = sizes[size];

  return (
    <div
      className={`relative shrink-0 ${box} ${className}`}
      aria-hidden={size !== "lg"}
    >
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 p-[2px] dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-600 ${ring} ring-zinc-200/80 dark:ring-zinc-700/80`}
      >
        <div className="h-full w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={site.image}
            alt={size === "lg" ? site.name : ""}
            width={image}
            height={image}
            className="h-full w-full object-cover object-[center_20%]"
            priority={size === "lg"}
          />
        </div>
      </div>
    </div>
  );
}
