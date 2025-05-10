document.addEventListener('DOMContentLoaded', () => {
  const sandbox = document.getElementById('sandbox');
  const surface = document.getElementsByTagName('body')[0];

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

  const dot = document.getElementsByClassName('dot')[0];

  // if (true) {
    surface.addEventListener('mousemove', (e) => {
      // var halfViewer = dot.offsetWidth / 2;
      // var rect = e.target.getBoundingClientRect();
      // console.log(e);
      var x = e.clientX;
      var y = e.clientY;
      dot.style.left = x;
      dot.style.top = y;
      // dot.style.backgroundPosition = -x + 'px' + ' ' + -y + 'px';
    });
  // }
});
