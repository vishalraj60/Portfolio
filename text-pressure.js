// Text Pressure Animation - Vanilla JS Version
class TextPressure {
  constructor(options = {}) {
    this.container = options.container;
    this.text = options.text || 'VISHAL RAJ';
    this.fontFamily = options.fontFamily || 'Arial, sans-serif';
    this.textColor = options.textColor || 'rgba(0, 217, 255, 0.1)';
    this.minFontSize = options.minFontSize || 80;
    
    this.mouse = { x: 0, y: 0 };
    this.cursor = { x: 0, y: 0 };
    this.spans = [];
    
    this.init();
  }
  
  init() {
    this.createElements();
    this.setupEventListeners();
    this.setSize();
    this.animate();
  }
  
  createElements() {
    const chars = this.text.split('');
    
    this.title = document.createElement('h1');
    this.title.className = 'text-pressure-title';
    this.title.style.cssText = `
      font-family: ${this.fontFamily};
      text-transform: uppercase;
      font-size: ${this.minFontSize}px;
      line-height: 1;
      margin: 0;
      text-align: center;
      user-select: none;
      white-space: nowrap;
      font-weight: 100;
      width: 100%;
      color: ${this.textColor};
      display: flex;
      justify-content: center;
      gap: 0;
    `;
    
    chars.forEach(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.cssText = `
        display: inline-block;
        transition: font-variation-settings 0.1s ease;
      `;
      this.spans.push(span);
      this.title.appendChild(span);
    });
    
    this.container.appendChild(this.title);
    
    // Set initial cursor position to center
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = rect.left + rect.width / 2;
    this.mouse.y = rect.top + rect.height / 2;
    this.cursor.x = this.mouse.x;
    this.cursor.y = this.mouse.y;
  }
  
  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
    });
    
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.cursor.x = touch.clientX;
      this.cursor.y = touch.clientY;
    }, { passive: true });
    
    window.addEventListener('resize', () => this.setSize());
  }
  
  setSize() {
    if (!this.container || !this.title) return;
    
    const containerRect = this.container.getBoundingClientRect();
    let newFontSize = containerRect.width / (this.text.length / 2);
    newFontSize = Math.max(newFontSize, this.minFontSize);
    
    this.title.style.fontSize = `${newFontSize}px`;
  }
  
  dist(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  getAttr(distance, maxDist, minVal, maxVal) {
    const val = maxVal - Math.abs((maxVal * distance) / maxDist);
    return Math.max(minVal, val + minVal);
  }
  
  animate() {
    this.mouse.x += (this.cursor.x - this.mouse.x) / 15;
    this.mouse.y += (this.cursor.y - this.mouse.y) / 15;
    
    if (this.title) {
      const titleRect = this.title.getBoundingClientRect();
      const maxDist = titleRect.width / 2;
      
      this.spans.forEach(span => {
        const rect = span.getBoundingClientRect();
        const charCenter = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        };
        
        const d = this.dist(this.mouse, charCenter);
        const scale = this.getAttr(d, maxDist, 0.8, 1.5);
        const opacity = this.getAttr(d, maxDist, 0.3, 1);
        
        span.style.transform = `scale(${scale})`;
        span.style.opacity = opacity;
      });
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const bgContainer = document.getElementById('text-pressure-bg');
  if (bgContainer) {
    new TextPressure({
      container: bgContainer,
      text: 'VISHAL RAJ',
      textColor: 'rgba(0, 217, 255, 0.08)',
      minFontSize: 60
    });
  }
});
