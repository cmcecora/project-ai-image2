import { triggerHaptic, hapticSuccess, hapticError, hapticLight } from '../haptics'

describe('Haptics Utility', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('triggerHaptic', () => {
    it('should call navigator.vibrate with correct pattern for success', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      triggerHaptic('success')
      
      expect(vibrateSpy).toHaveBeenCalledWith([50, 30, 50])
    })

    it('should call navigator.vibrate with correct pattern for error', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      triggerHaptic('error')
      
      expect(vibrateSpy).toHaveBeenCalledWith([100, 50, 100, 50, 100])
    })

    it('should call navigator.vibrate with correct duration for light', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      triggerHaptic('light')
      
      expect(vibrateSpy).toHaveBeenCalledWith(10)
    })

    it('should call navigator.vibrate with correct duration for medium', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      triggerHaptic('medium')
      
      expect(vibrateSpy).toHaveBeenCalledWith(30)
    })

    it('should call navigator.vibrate with correct duration for heavy', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      triggerHaptic('heavy')
      
      expect(vibrateSpy).toHaveBeenCalledWith(50)
    })

    it('should not throw error if vibrate is not supported', () => {
      // Remove vibrate temporarily
      const originalVibrate = navigator.vibrate
      // @ts-expect-error - Testing error case
      delete navigator.vibrate
      
      expect(() => triggerHaptic('light')).not.toThrow()
      
      // Restore
      Object.defineProperty(navigator, 'vibrate', {
        writable: true,
        value: originalVibrate,
      })
    })
  })

  describe('hapticSuccess', () => {
    it('should trigger success haptic pattern', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      hapticSuccess()
      
      expect(vibrateSpy).toHaveBeenCalledWith([50, 30, 50])
    })
  })

  describe('hapticError', () => {
    it('should trigger error haptic pattern', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      hapticError()
      
      expect(vibrateSpy).toHaveBeenCalledWith([100, 50, 100, 50, 100])
    })
  })

  describe('hapticLight', () => {
    it('should trigger light haptic feedback', () => {
      const vibrateSpy = jest.spyOn(navigator, 'vibrate')
      
      hapticLight()
      
      expect(vibrateSpy).toHaveBeenCalledWith(10)
    })
  })
})

