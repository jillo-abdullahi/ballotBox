import type { ReactNode } from 'react';

interface MetadataPillProps {
  children: ReactNode;
}

export default function MetadataPill({ children }: MetadataPillProps) {
  return (
    <div className="bg-neutral-800/50 rounded-xl px-3 py-1.5 flex items-center justify-center h-8">
      {children}
    </div>
  );
}
