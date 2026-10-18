const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const faqItems = document.querySelectorAll('.faq-item');
const modalBackdrop = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');
const formSuccessMessage = document.getElementById('projectFormSuccess');
const scrollTopButton = document.querySelector('.scroll-top');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  if (!question) return;

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    faqItems.forEach((faq) => {
      faq.classList.remove('active');
      const answer = faq.querySelector('.faq-answer');
      if (answer) answer.style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      const answer = item.querySelector('.faq-answer');
      if (answer) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    }
  });
});

function openModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.add('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });
});

document.querySelectorAll('.modal-close').forEach((closeButton) => {
  closeButton.addEventListener('click', closeModal);
});

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) closeModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
    closeModal();
  }
});

if (projectForm) {
  projectForm.addEventListener('submit', function (event) {
    const submitButton = this.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    const form = this;
    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    }).then((response) => {
      if (response.ok || response.status === 200 || response.status === 0) {
        form.reset();
        formSuccessMessage?.classList.add('is-visible');
        setTimeout(() => {
          closeModal();
          formSuccessMessage?.classList.remove('is-visible');
        }, 2200);
      } else {
        window.location.href = 'mailto:hello.salesforce.ai@gmail.com?subject=' + encodeURIComponent('Project inquiry from website') + '&body=' + encodeURIComponent(new URLSearchParams(formData).toString());
      }
    }).catch(() => {
      window.location.href = 'mailto:hello.salesforce.ai@gmail.com?subject=' + encodeURIComponent('Project inquiry from website') + '&body=' + encodeURIComponent(new URLSearchParams(formData).toString());
    }).finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send project request';
      }
    });

    event.preventDefault();
  });
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopButton?.classList.add('is-visible');
  } else {
    scrollTopButton?.classList.remove('is-visible');
  }
});

scrollTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
