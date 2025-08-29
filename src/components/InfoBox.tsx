import type { ReactNode } from "react";

interface InfoPillProps {
  label: string;
  children: ReactNode;
  textColor?: string;
}

export default function InfoBox({
  label,
  children,
  textColor = "text-teal-text/80",
}: InfoPillProps) {
  const pillStyle = `rounded-xl px-8 py-3 flex flex-col items-start justify-center space-y-1`;
  return (
    <div className={pillStyle}>
      <span className={`text-sm ${textColor}`}>{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}
