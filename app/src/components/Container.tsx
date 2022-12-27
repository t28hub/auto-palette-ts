import { ReactElement, ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
}

export default function Container({ children }: Props): ReactElement {
  return (
    <div className={'mx-auto max-w-5xl px-2'}>
      {children}
    </div>
  );
}
