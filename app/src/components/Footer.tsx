import { ReactElement, useEffect, useState } from 'react';

export default function Footer(): ReactElement {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    const date = new Date();
    setYear(date.getFullYear());
  }, []);

  return (
    <footer className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-slate-900/0 to-slate-900/50 p-4">
      <div className="flex flex-col items-center">
        <p className="prose prose-sm font-normal text-slate-100/80">
          Copyright © {year} Tatsuya Maki. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
