function initPokemonCursor() {
  const cursor = document.createElement('div');
  cursor.id = 'pokemon-cursor';
  cursor.style.opacity = '0'; // Start with cursor invisible
  document.body.appendChild(cursor);

  const updateCursorPosition = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Check if cursor is within viewport
    if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
      cursor.style.opacity = '1';
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    } else {
      // Hide cursor when it's out of the viewport
      cursor.style.opacity = '0';
    }
  };

  // Set initial cursor position and make it visible
  const setInitialPosition = () => {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    cursor.style.opacity = '1';
  };

  // Call setInitialPosition after a short delay to ensure the DOM is ready
  setTimeout(setInitialPosition, 100);

  document.addEventListener('mousemove', updateCursorPosition);
  
  // Handle cursor reappearance when re-entering the window
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.backgroundImage = "url('./assets/img/cursors/click.png')";
  });

  document.addEventListener('mouseup', () => {
    cursor.style.backgroundImage = "url('./assets/img/cursors/default.png')";
  });

  document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"], .clickable').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursor.style.backgroundImage = "url('./assets/img/cursors/hover.png')";
    });
    elem.addEventListener('mouseleave', () => {
      cursor.style.backgroundImage = "url('./assets/img/cursors/default.png')";
    });
  });

  document.querySelectorAll('[draggable="true"]').forEach(elem => {
    elem.addEventListener('mousedown', () => {
      cursor.style.backgroundImage = "url('./assets/img/cursors/drag.png')";
    });
    elem.addEventListener('mouseup', () => {
      cursor.style.backgroundImage = "url('./assets/img/cursors/default.png')";
    });
  });
}

// Initialize the Pokemon cursor
document.addEventListener('DOMContentLoaded', initPokemonCursor);