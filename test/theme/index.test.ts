import { type ThemeVisitor, visit } from '@internal/theme';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Theme', () => {
  describe('visit', () => {
    let visitor: ThemeVisitor<string, string>;
    beforeEach(() => {
      visitor = {
        visitBasic: vi.fn(() => 'basic visited'),
        visitVivid: vi.fn(() => 'vivid visited'),
        visitMuted: vi.fn(() => 'muted visited'),
        visitLight: vi.fn(() => 'light visited'),
        visitDark: vi.fn(() => 'dark visited'),
      };
    });

    it('should visit the basic theme', () => {
      // Act
      const actual = visit('basic', visitor, 'param');

      // Assert
      expect(actual).toEqual('basic visited');
      expect(visitor.visitBasic).toHaveBeenCalledWith('param');
      expect(visitor.visitVivid).not.toHaveBeenCalled();
      expect(visitor.visitMuted).not.toHaveBeenCalled();
      expect(visitor.visitLight).not.toHaveBeenCalled();
      expect(visitor.visitDark).not.toHaveBeenCalled();
    });

    it('should visit the vivid theme', () => {
      // Act
      const actual = visit('vivid', visitor, 'param');

      // Assert
      expect(actual).toEqual('vivid visited');
      expect(visitor.visitBasic).not.toHaveBeenCalled();
      expect(visitor.visitVivid).toHaveBeenCalledWith('param');
      expect(visitor.visitMuted).not.toHaveBeenCalled();
      expect(visitor.visitLight).not.toHaveBeenCalled();
      expect(visitor.visitDark).not.toHaveBeenCalled();
    });

    it('should visit the muted theme', () => {
      // Act
      const actual = visit('muted', visitor, 'param');

      // Assert
      expect(actual).toEqual('muted visited');
      expect(visitor.visitBasic).not.toHaveBeenCalled();
      expect(visitor.visitVivid).not.toHaveBeenCalled();
      expect(visitor.visitMuted).toHaveBeenCalledWith('param');
      expect(visitor.visitLight).not.toHaveBeenCalled();
      expect(visitor.visitDark).not.toHaveBeenCalled();
    });

    it('should visit the light theme', () => {
      // Act
      const actual = visit('light', visitor, 'param');

      // Assert
      expect(actual).toEqual('light visited');
      expect(visitor.visitBasic).not.toHaveBeenCalled();
      expect(visitor.visitVivid).not.toHaveBeenCalled();
      expect(visitor.visitMuted).not.toHaveBeenCalled();
      expect(visitor.visitLight).toHaveBeenCalledWith('param');
      expect(visitor.visitDark).not.toHaveBeenCalled();
    });

    it('should visit the dark theme', () => {
      // Act
      const actual = visit('dark', visitor, 'param');

      // Assert
      expect(actual).toEqual('dark visited');
      expect(visitor.visitBasic).not.toHaveBeenCalled();
      expect(visitor.visitVivid).not.toHaveBeenCalled();
      expect(visitor.visitMuted).not.toHaveBeenCalled();
      expect(visitor.visitLight).not.toHaveBeenCalled();
      expect(visitor.visitDark).toHaveBeenCalledWith('param');
    });
  });
});
