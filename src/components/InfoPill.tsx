import type { ReactNode } from "react";

interface InfoPillProps {
  label: string;
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
}

export default function InfoPill({
  label,
  children,
  bgColor = "bg-teal-text/20",
  textColor = "text-teal-text/80",
}: InfoPillProps) {
  const pillStyle = `${bgColor} rounded-full px-8 py-3 flex items-center justify-between`;
  return (
    <div className={pillStyle}>
      <span className={`text-sm ${textColor}`}>{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
