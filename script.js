const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const faqItems = document.querySelectorAll('.faq-item');
const modal = document.getElementById('projectModal');
const modalClose = document.querySelector('.modal-close');
const modalTriggers = document.querySelectorAll('[data-open-modal="projectModal"]');
const projectForm = document.getElementById('projectForm');
const formSuccess = document.getElementById('projectFormSuccess');
const scrollTopButton = document.querySelector('.scroll-top');
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleIcon = document.querySelector('.theme-toggle-icon');

function applyTheme(mode) {
  const isLight = mode === 'light';
  document.body.classList.toggle('light-mode', isLight);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Toggle dark mode' : 'Toggle light mode');
  }

  if (themeToggleIcon) {
    themeToggleIcon.textContent = isLight ? '🌙' : '☀️';
  }
}

const savedTheme = localStorage.getItem('salesforce-ai-theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextMode = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem('salesforce-ai-theme', nextMode);
    applyTheme(nextMode);
  });
}

function openWalletPayment(wallet, amount) {
  const amountValue = Number(amount || 0);
  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    return;
  }

  const upiId = 'htjnvk@okaxis';
  const name = 'Support%20Children%20and%20Elders';
  const tn = 'Donation%20for%20Education%20and%20Care';
  const amountText = amountValue.toFixed(2);
  const fallbackUrl = encodeURIComponent('https://h3nsure.github.io/salesforce-ai-agency/donation.html');

  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amountText}&cu=INR&tn=${tn}`;

  const walletPackages = {
    googlepay: 'com.google.android.apps.nbu.paisa.user',
    phonepe: 'com.phonepe.app',
    paytm: 'net.one97.paytm'
  };

  const packageName = walletPackages[wallet] || walletPackages.googlepay;
  const intentLink = `intent://pay?pa=${upiId}&pn=${name}&am=${amountText}&cu=INR&tn=${tn}#Intent;scheme=upi;package=${packageName};S.browser_fallback_url=${fallbackUrl};end;`;

  window.location.href = intentLink;
  window.setTimeout(() => {
    window.location.href = upiLink;
  }, 1200);
}

const donationButtons = document.querySelectorAll('.amount-btn');
donationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const amount = button.dataset.amount;
    const wallet = button.dataset.wallet || 'googlepay';
    openWalletPayment(wallet, amount);
  });
});

if (toggle && header) {
  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function openProjectModal() {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openProjectModal();
  });
});

if (modalClose) {
  modalClose.addEventListener('click', closeProjectModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeProjectModal();
    }
  });
}

function syncModalFromHash() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#contact' || hash === '#projectmodal' || hash === '#start-project') {
    openProjectModal();
  } else if (!hash) {
    closeProjectModal();
  }
}

window.addEventListener('hashchange', syncModalFromHash);
syncModalFromHash();

if (projectForm) {
  projectForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(projectForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://formsubmit.co/ajax/hello.salesforce.ai@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          ...payload,
          _subject: 'New project inquiry from Salesforce AI website',
          _captcha: 'false'
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      if (formSuccess) {
        formSuccess.classList.add('visible');
      }

      projectForm.reset();

      window.setTimeout(() => {
        closeProjectModal();
        if (formSuccess) {
          formSuccess.classList.remove('visible');
        }
      }, 2000);
    } catch (error) {
      window.location.href = 'mailto:hello.salesforce.ai@gmail.com?subject=' + encodeURIComponent('Project inquiry') + '&body=' + encodeURIComponent(
        'Name: ' + (payload.name || '') + '\n' +
        'Email: ' + (payload.email || '') + '\n' +
        'Company: ' + (payload.company || '') + '\n' +
        'Project type: ' + (payload.projectType || '') + '\n' +
        'Timeline: ' + (payload.timeline || '') + '\n' +
        'Budget: ' + (payload.budget || '') + '\n\n' +
        'Project details:\n' + (payload.details || '')
      );
    }
  });
}

if (scrollTopButton) {
  const toggleScrollTopButton = () => {
    const shouldShow = window.scrollY > 420;
    scrollTopButton.classList.toggle('visible', shouldShow);
  };

  toggleScrollTopButton();
  window.addEventListener('scroll', toggleScrollTopButton, { passive: true });

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!button || !answer) return;

  const setOpenState = () => {
    const isOpen = item.classList.contains('active');
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
  };

  setOpenState();

  button.addEventListener('click', () => {
    const active = item.classList.contains('active');

    faqItems.forEach((faq) => {
      faq.classList.remove('active');
      const faqAnswer = faq.querySelector('.faq-answer');
      if (faqAnswer) {
        faqAnswer.style.maxHeight = '0px';
      }
    });

    if (!active) {
      item.classList.add('active');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});
