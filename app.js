(function () {

  const $ = id => document.getElementById(id);

  const statusEl = $('status');
  const btnShow = $('btnShow');
  const btnRefresh = $('btnRefresh');
  const minAmountInput = $('minAmount');
  const dealsBody = $('dealsBody');
  const noResults = $('noResults');

  function setStatus(text) {
    if (!statusEl) return;
    statusEl.textContent = text;
  }

  function clearTable() {
    dealsBody.innerHTML = '';
  }

  function renderDeals(rows) {
    clearTable();
    if (!rows || rows.length === 0) {
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;
    const fragment = document.createDocumentFragment();
    for (const r of rows) {
      const tr = document.createElement('tr');
      const tdId = document.createElement('td');
      tdId.textContent = r.ID || '';
      const tdTitle = document.createElement('td');
      tdTitle.textContent = r.TITLE || '';
      const tdOpp = document.createElement('td');
      tdOpp.textContent = r.OPPORTUNITY != null ? r.OPPORTUNITY : '';
      tr.appendChild(tdId);
      tr.appendChild(tdTitle);
      tr.appendChild(tdOpp);
      fragment.appendChild(tr);
    }
    dealsBody.appendChild(fragment);
  }

  // Fetch all pages of crm.deal.list using BX24.callMethod and pagination via result.next()
  function fetchDealsFromBitrix(filter = {}) {
    return new Promise((resolve, reject) => {
      if (!window.BX24 || typeof BX24.callMethod !== 'function') {
        reject(new Error('BX24 API недоступен. Приложение должно быть запущено внутри Bitrix24.'));
        return;
      }

      const accumulated = [];

      const params = {
        order: { "ID": "DESC" },
        filter: filter,
        select: ["ID", "TITLE", "OPPORTUNITY"]
      };

      BX24.callMethod('crm.deal.list', params, function (result) {
        if (result.error()) {
          reject(result.error());
          return;
        }
        const data = result.data();
        if (Array.isArray(data)) accumulated.push(...data);

        if (result.more()) {
     
          result.next(function (res2) {
            if (res2.error()) {
              reject(res2.error());
              return;
            }
            const d2 = res2.data();
            if (Array.isArray(d2)) accumulated.push(...d2);

            (function continueNext(r) {
              if (r.more && typeof r.next === 'function') {
                r.next(function (nx) {
                  if (nx.error()) {
                    reject(nx.error());
                    return;
                  }
                  const dn = nx.data();
                  if (Array.isArray(dn)) accumulated.push(...dn);
                  r = nx;
                  continueNext(r);
                });
              } else {
                resolve(accumulated);
              }
            })(res2);
          });
        } else {
          resolve(accumulated);
        }
      });
    });
  }

  async function loadAndShow(minAmount = 0) {
    setStatus('Запрос сделок...');
    btnShow.disabled = true;
    btnRefresh.disabled = true;
    try {
      const filter = {};
      if (minAmount > 0) filter['>OPPORTUNITY'] = Number(minAmount);

      const deals = await fetchDealsFromBitrix(filter);
      setStatus(`Найдено сделок: ${deals.length}`);
      renderDeals(deals);
    } catch (err) {
      console.error(err);
      setStatus('Ошибка: ' + (err && err.error_description ? err.error_description : (err.message || String(err))));
      clearTable();
      noResults.hidden = false;
    } finally {
      btnShow.disabled = false;
      btnRefresh.disabled = false;
    }
  }

  function init() {

    if (!window.BX24) {
      setStatus('Предупреждение: BX24 API недоступен. Загрузите приложение как локальное приложение в Bitrix24.');
    } else {
      setStatus('Готов. Нажмите «Показать», чтобы загрузить сделки.');
    }

    btnShow.addEventListener('click', function () {
      const val = Number(minAmountInput.value) || 0;
      setStatus('Фильтрация и загрузка...');
      loadAndShow(val);
    });

    btnRefresh.addEventListener('click', function () {
      const val = Number(minAmountInput.value) || 0;
      loadAndShow(val);
    });

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
