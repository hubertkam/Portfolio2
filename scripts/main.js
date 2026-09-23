// Site behaviour: mobile menu, contact form, figure enlarging, footer year.
(function () {
  'use strict';

  // ---- Mobile menu -------------------------------------------------------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
      nav.dataset.open = String(open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // ---- Footer year -------------------------------------------------------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // ---- Contact form (EmailJS) --------------------------------------------
  // The EmailJS public key is meant to be public. Protect the form by
  // restricting allowed origins in the EmailJS dashboard (Account > Security).
  var form = document.getElementById('contact-form');
  if (form) {
    var EMAIL = 'hubertkaminski2005@gmail.com';
    var status = document.getElementById('form-status');
    var button = form.querySelector('button[type="submit"]');
    var hasEmailJS = typeof window.emailjs !== 'undefined';
    if (hasEmailJS) {
      try { window.emailjs.init('6kEwmB4NqQhd0k81i'); } catch (err) { hasEmailJS = false; }
    }

    var show = function (message, state) {
      status.textContent = message;
      status.dataset.state = state;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (!hasEmailJS) {
        show('The form is unavailable right now. Email me at ' + EMAIL + '.', 'error');
        return;
      }
      var data = new FormData(form);
      button.disabled = true;
      button.textContent = 'Sending…';
      show('', '');
      window.emailjs.send('service_ijob117', 'template_vffjf3r', {
        from_name: data.get('name'),
        from_email: data.get('email'),
        subject: data.get('subject'),
        message: data.get('message'),
        to_name: 'Hubert Kamiński'
      }).then(function () {
        form.reset();
        show('Message sent. I’ll reply by email.', 'success');
      }, function () {
        show('Your message didn’t send. Email me directly at ' + EMAIL + '.', 'error');
      }).then(function () {
        button.disabled = false;
        button.textContent = 'Send message';
      });
    });
  }

  // ---- Enlarge figures on project pages ----------------------------------
  // Without JavaScript, figure links simply open the full-size image.
  var dialog = document.querySelector('.lightbox');
  if (dialog && typeof dialog.showModal === 'function') {
    var bigImg = dialog.querySelector('img');
    var caption = dialog.querySelector('.lightbox__caption');
    document.querySelectorAll('a.fig__frame').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = link.querySelector('img');
        var figcaption = link.closest('figure').querySelector('figcaption');
        bigImg.src = link.getAttribute('href');
        bigImg.alt = thumb ? thumb.alt : '';
        caption.textContent = figcaption ? figcaption.textContent.replace(/\s+/g, ' ').trim() : '';
        dialog.showModal();
      });
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('.lightbox__close')) dialog.close();
    });
    dialog.addEventListener('close', function () { bigImg.removeAttribute('src'); });
  }
})();
