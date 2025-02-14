document.addEventListener('DOMContentLoaded', () => {
  const sandbox = document.getElementById('sandbox');

  sandbox.addEventListener('touchstart', (e) => {
    e.preventDefault();

    [...e.changedTouches].forEach(touch => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.style.top = `${touch.pageY}px`;
      dot.style.left = `${touch.pageX}px`;
      dot.id =touch.identifier;
      sandbox.append(dot);
    });
  });

  sandbox.addEventListener('touchmove', (e) => {
    e.preventDefault();

    [...e.changedTouches].forEach(touch => {
      const dot = document.getElementById(touch.identifier);
      dot.style.top = `${touch.pageY}px`;
      dot.style.left = `${touch.pageX}px`;
    });
  });

  sandbox.addEventListener('touchend', (e) => {
    e.preventDefault();

    [...e.changedTouches].forEach(touch => {
      const dot = document.getElementById(touch.identifier);
      dot.remove();
    });
  });
});
