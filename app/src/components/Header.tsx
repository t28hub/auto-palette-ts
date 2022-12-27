import React, { ReactElement } from 'react';
import { FaGithub } from 'react-icons/all';

export default function Header(): ReactElement {
  return (
    <header className="px-8 py-2 bg-gradient-to-b from-slate-900/80 to-slate-900/0">
      <div className="flex flex-row items-center justify-between">
        <div className="prose prose-2xl font-bold text-slate-100 select-none">Auto Palette</div>

        <ul className="flex flex-row">
          <li className="hover:opacity-20 duration-300">
            <a href="https://github.com/t28hub/auto-palette" target="_blank" rel="noreferrer" aria-label="github">
              <FaGithub className={'text-2xl'} />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
