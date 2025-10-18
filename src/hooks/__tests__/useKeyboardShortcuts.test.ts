import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  let handlers: {
    onLeftArrow: jest.Mock
    onRightArrow: jest.Mock
    onSpace: jest.Mock
    onEnter: jest.Mock
    onEscape: jest.Mock
    onY: jest.Mock
    onN: jest.Mock
  }

  beforeEach(() => {
    handlers = {
      onLeftArrow: jest.fn(),
      onRightArrow: jest.fn(),
      onSpace: jest.fn(),
      onEnter: jest.fn(),
      onEscape: jest.fn(),
      onY: jest.fn(),
      onN: jest.fn(),
    }
  })

  it('should call onLeftArrow when left arrow key is pressed', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
    window.dispatchEvent(event)

    expect(handlers.onLeftArrow).toHaveBeenCalled()
  })

  it('should call onRightArrow when right arrow key is pressed', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    window.dispatchEvent(event)

    expect(handlers.onRightArrow).toHaveBeenCalled()
  })

  it('should call onSpace when space key is pressed', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const event = new KeyboardEvent('keydown', { key: ' ' })
    window.dispatchEvent(event)

    expect(handlers.onSpace).toHaveBeenCalled()
  })

  it('should call onEnter when enter key is pressed', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)

    expect(handlers.onEnter).toHaveBeenCalled()
  })

  it('should call onY when Y key is pressed', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const event = new KeyboardEvent('keydown', { key: 'y' })
    window.dispatchEvent(event)

    expect(handlers.onY).toHaveBeenCalled()
  })

  it('should call onN when N key is pressed', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    const event = new KeyboardEvent('keydown', { key: 'n' })
    window.dispatchEvent(event)

    expect(handlers.onN).toHaveBeenCalled()
  })

  it('should not trigger shortcuts when disabled', () => {
    renderHook(() => useKeyboardShortcuts(handlers, false))

    const event = new KeyboardEvent('keydown', { key: 'y' })
    window.dispatchEvent(event)

    expect(handlers.onY).not.toHaveBeenCalled()
  })

  it('should not trigger shortcuts when typing in input field', () => {
    renderHook(() => useKeyboardShortcuts(handlers))

    // Create a mock input element
    const input = document.createElement('input')
    document.body.appendChild(input)

    // Simulate keydown on input
    const event = new KeyboardEvent('keydown', { key: 'y', bubbles: true })
    Object.defineProperty(event, 'target', { value: input, enumerable: true })
    input.dispatchEvent(event)

    expect(handlers.onY).not.toHaveBeenCalled()

    // Cleanup
    document.body.removeChild(input)
  })

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    
    const { unmount } = renderHook(() => useKeyboardShortcuts(handlers))
    
    unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})

