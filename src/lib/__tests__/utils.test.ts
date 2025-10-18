import { cn } from '../utils'

describe('Utils', () => {
  describe('cn (classnames utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('should filter out false/null/undefined values', () => {
      const result = cn('class1', false && 'class2', null, undefined, 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class3')
      expect(result).not.toContain('class2')
    })

    it('should handle Tailwind conflicts correctly', () => {
      // The cn function should use clsx and tailwind-merge
      // tailwind-merge should resolve conflicts
      const result = cn('px-2 py-1', 'p-3')
      // p-3 should override px-2 py-1
      expect(result).toContain('p-3')
      expect(result).not.toContain('px-2')
      expect(result).not.toContain('py-1')
    })
  })
})

