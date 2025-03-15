
/**
 * Utility function to create staggered animations by adding delay classes
 * @param totalItems Number of items to animate
 * @param baseDelay Base delay between animations in ms
 * @returns Array of delay class names
 */
export const createStaggeredAnimationDelays = (
  totalItems: number,
  baseDelay: number = 100
): string[] => {
  return Array.from({ length: totalItems }, (_, i) => {
    const delay = i * baseDelay;
    if (delay <= 500) {
      return `delay-${delay}`;
    } else {
      // For delays > 500ms, use inline style
      return `delay-500`;
    }
  });
};

/**
 * Trigger an animation on a DOM element
 * @param element The DOM element to animate
 * @param animationClass The animation class to apply
 * @param duration Duration of animation in ms
 */
export const triggerAnimation = (
  element: HTMLElement,
  animationClass: string,
  duration: number = 300
): void => {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
};

/**
 * Creates an intersection observer to trigger animations when elements enter the viewport
 * @param animationClass The animation class to apply
 * @param threshold Intersection threshold (0-1)
 * @returns IntersectionObserver instance
 */
export const createScrollAnimationObserver = (
  animationClass: string = "animate-slide-up",
  threshold: number = 0.1
): IntersectionObserver => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          // Once the animation has played, we can unobserve the element
          // observer.unobserve(entry.target);
        } else {
          entry.target.classList.remove(animationClass);
        }
      });
    },
    { threshold }
  );
};
