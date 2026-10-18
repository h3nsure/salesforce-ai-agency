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

function showPaymentNotice(message) {
  let existing = document.querySelector('.payment-toast');
  if (existing) {
    existing.textContent = message;
    existing.classList.add('visible');
    window.clearTimeout(existing._timer);
  } else {
    existing = document.createElement('div');
    existing.className = 'payment-toast';
    existing.textContent = message;
    document.body.appendChild(existing);
    existing.classList.add('visible');
  }

  existing._timer = window.setTimeout(() => {
    existing.classList.remove('visible');
  }, 2600);
}

function openWalletPayment(wallet, amount) {
  const amountValue = Number(amount || 0);
  if (!Number.isFinite(amountValue) || amountValue <= 0) {
    return;
  }

  const walletNames = {
    googlepay: 'Google Pay',
    phonepe: 'PhonePe',
    paytm: 'Paytm'
  };

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) {
    showPaymentNotice(`Please open this page on a mobile device to pay with ${walletNames[wallet] || 'your wallet'}.`);
    return;
  }

  const upiId = 'htjnvk@okaxis';
  const payerName = 'Support Children and Elders';
  const note = 'Donation for Education and Care';
  const amountText = amountValue.toFixed(2);
  const upiParams = `pa=${upiId}&pn=${encodeURIComponent(payerName)}&am=${amountText}&cu=INR&tn=${encodeURIComponent(note)}`;
  const chooserLink = `upi://pay?${upiParams}`;
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const walletLinks = {
    googlepay: [
      `gpay://upi/pay?${upiParams}`,
      `googlepay://upi/pay?${upiParams}`,
      `tez://upi/pay?${upiParams}`,
      `upi://pay?${upiParams}`
    ],
    phonepe: isAndroid ? [
      `phonepe://pay?${upiParams}`,
      `upi://pay?${upiParams}`
    ] : [`upi://pay?${upiParams}`],
    paytm: isAndroid ? [
      `paytmmp://pay?${upiParams}`,
      `upi://pay?${upiParams}`
    ] : [`upi://pay?${upiParams}`]
  };

  const links = [...(walletLinks[wallet] || walletLinks.googlepay)];
  const openWithFallback = (index) => {
    if (index >= links.length) {
      if (wallet === 'googlepay') {
        showPaymentNotice('Google Pay app did not open. Please ensure Google Pay is installed and try again.');
        if (isAndroid) {
          window.location.href = 'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user';
        }
        return;
      }

      window.location.href = chooserLink;
      return;
    }

    const nextLink = links[index];
    window.location.href = nextLink;

    window.setTimeout(() => {
      openWithFallback(index + 1);
    }, 900);
  };

  try {
    if (isAndroid || wallet === 'googlepay') {
      openWithFallback(0);
      return;
    }

    window.location.href = links[0];
  } catch (error) {
    window.location.href = chooserLink;
  }

  if (!isAndroid && wallet !== 'googlepay') {
    window.setTimeout(() => {
      window.location.href = chooserLink;
    }, 1200);
  }
}

const walletChooser = document.getElementById('walletChooserModal');
const walletChooserClose = document.querySelector('.wallet-chooser-close');
const walletChoiceButtons = document.querySelectorAll('[data-wallet-choice]');
let pendingWalletSelection = null;

function openWalletChooser(wallet, amount) {
  pendingWalletSelection = { wallet, amount: Number(amount || 0) };
  if (!walletChooser) return;
  walletChooser.classList.add('is-open');
  walletChooser.setAttribute('aria-hidden', 'false');
}

function closeWalletChooser() {
  if (!walletChooser) return;
  walletChooser.classList.remove('is-open');
  walletChooser.setAttribute('aria-hidden', 'true');
  pendingWalletSelection = null;
}

if (walletChooserClose) {
  walletChooserClose.addEventListener('click', closeWalletChooser);
}

if (walletChooser) {
  walletChooser.addEventListener('click', (event) => {
    if (event.target === walletChooser) {
      closeWalletChooser();
    }
  });
}

walletChoiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const wallet = button.dataset.walletChoice || 'googlepay';
    const amount = pendingWalletSelection ? pendingWalletSelection.amount : 100;
    closeWalletChooser();
    openWalletPayment(wallet, amount);
  });
});

const qrBoxes = document.querySelectorAll('.qr-box');
qrBoxes.forEach((qrBox) => {
  const trigger = () => {
    const wallet = qrBox.dataset.wallet || 'googlepay';
    const amount = 100;
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid || wallet === 'googlepay') {
      openWalletPayment(wallet, amount);
      return;
    }

    openWalletChooser(wallet, amount);
  };

  qrBox.addEventListener('click', trigger);
  qrBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      trigger();
    }
  });
});

const donationButtons = document.querySelectorAll('.amount-btn');
donationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const amount = button.dataset.amount;
    const wallet = button.dataset.wallet || 'googlepay';
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid && wallet !== 'googlepay') {
      openWalletPayment(wallet, amount);
      return;
    }

    openWalletChooser(wallet, amount);
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
