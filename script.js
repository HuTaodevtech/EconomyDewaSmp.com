document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var hint = btn.closest('.ip-field') ? btn.closest('.ip-field').querySelector('.copy-hint') : null;
      var done = function () {
        btn.classList.add('copied');
        if (hint) hint.textContent = 'Tersalin ke clipboard';
        setTimeout(function () {
          btn.classList.remove('copied');
          if (hint) hint.textContent = '';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () {
          fallbackCopy(value);
          done();
        });
      } else {
        fallbackCopy(value);
        done();
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // rank tabs
  var tabs = document.querySelectorAll('.rank-tab');
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-target');
        document.querySelectorAll('.rank-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.rank-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        document.getElementById(target).classList.add('active');
      });
    });
  }

  // WhatsApp admin buy dropdown
  var ADMIN_NUMBERS = {
    clay: '6285761779383',
    winata: '62882016270154'
  };
  var ADMIN_LABELS = {
    clay: 'Admin Clay',
    winata: 'Admin Winata'
  };

  document.querySelectorAll('.buy-dropdown .rank-tier-buy').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var menu = btn.nextElementSibling;
      var isOpen = menu.classList.contains('open');
      document.querySelectorAll('.buy-menu.open').forEach(function (m) { m.classList.remove('open'); });
      if (!isOpen) menu.classList.add('open');
    });
  });

  document.querySelectorAll('.buy-menu-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var dropdown = item.closest('.buy-dropdown');
      var rank = dropdown.getAttribute('data-rank');
      var price = dropdown.getAttribute('data-price');
      var admin = item.getAttribute('data-admin');
      dropdown.querySelector('.buy-menu').classList.remove('open');
      openQrisModal(rank, price, admin);
    });
  });

  var qrisOverlay = document.getElementById('qrisOverlay');
  var qrisRankEl = document.getElementById('qrisRank');
  var qrisPriceEl = document.getElementById('qrisPrice');
  var qrisConfirmBtn = document.getElementById('qrisConfirm');
  var qrisCloseBtn = document.getElementById('qrisClose');
  var currentOrder = null;

  function openQrisModal(rank, price, admin) {
    if (!qrisOverlay) return;
    currentOrder = { rank: rank, price: price, admin: admin };
    qrisRankEl.textContent = rank;
    qrisPriceEl.textContent = price;
    qrisOverlay.classList.add('open');
  }

  function closeQrisModal() {
    if (!qrisOverlay) return;
    qrisOverlay.classList.remove('open');
    currentOrder = null;
  }

  if (qrisCloseBtn) qrisCloseBtn.addEventListener('click', closeQrisModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeQrisModal();
  });
  if (qrisOverlay) {
    qrisOverlay.addEventListener('click', function (e) {
      if (e.target === qrisOverlay) closeQrisModal();
    });
  }
  if (qrisConfirmBtn) {
    qrisConfirmBtn.addEventListener('click', function () {
      if (!currentOrder) return;
      var number = ADMIN_NUMBERS[currentOrder.admin];
      var label = ADMIN_LABELS[currentOrder.admin];
      var message = 'Halo ' + label + ', saya sudah bayar QRIS untuk rank ' + currentOrder.rank + ' (' + currentOrder.price + ') di Economy Dewa SMP. Berikut bukti transfernya.';
      var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank', 'noopener');
      closeQrisModal();
    });
  }

  document.addEventListener('click', function () {
    document.querySelectorAll('.buy-menu.open').forEach(function (m) { m.classList.remove('open'); });
  });
});