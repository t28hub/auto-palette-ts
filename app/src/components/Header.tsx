import React, { ReactElement } from 'react';
import { FaGithub } from 'react-icons/all';

export default function Header(): ReactElement {
  return (
    <header className="bg-gradient-to-b from-slate-900/80 to-slate-900/0 px-8 py-2">
      <div className="flex flex-row items-center justify-between">
        <div className="prose prose-2xl select-none font-bold text-slate-100">Auto Palette</div>

        <ul className="flex flex-row">
          <li className="duration-300 hover:opacity-20">
            <a href="https://github.com/t28hub/auto-palette" target="_blank" rel="noreferrer" aria-label="github">
              <FaGithub className="text-2xl" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
