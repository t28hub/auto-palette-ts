import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Canvas from './Canvas.svelte';

describe('Canvas', () => {
  it('should render Canvas component', () => {
    render(Canvas, { src: 'test.jpeg', width: 480, height: 270 });

    const actual = screen.getByTestId('canvas');
    expect(actual).toBeInstanceOf(HTMLCanvasElement);
    expect((actual as HTMLCanvasElement).width).toEqual(480);
    expect((actual as HTMLCanvasElement).height).toEqual(270);
  });
});
