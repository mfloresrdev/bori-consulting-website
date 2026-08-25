/**
 * Generic renderer for any EstimatorEngine config — mounts a repeatable
 * item-row form plus a live totals panel. Works for window-door.config.js
 * today and any future trade config without changes here.
 */
(function (global) {
  'use strict';

  var currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === 'class') node.className = attrs[key];
      else if (key === 'text') node.textContent = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { node.appendChild(child); });
    return node;
  }

  function optionList(list, includeBlank) {
    var opts = [];
    list.forEach(function (item) {
      opts.push(el('option', { value: item.id, text: item.label }));
    });
    return opts;
  }

  function mountEstimator(containerId, config) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var rowsWrap = el('div', { class: 'estimator-rows' });
    var totalsPanel = el('div', { class: 'estimator-totals' });
    var addBtn = el('button', { type: 'button', class: 'btn secondary', text: '+ Add another item' });

    var rows = [];
    var rowCount = 0;

    function makeRow() {
      rowCount += 1;
      var rowId = 'row-' + rowCount;

      var itemTypeSelect = el('select', { 'aria-label': 'Item type' }, optionList(config.itemTypes));
      var materialSelect = el('select', { 'aria-label': 'Material' }, optionList(config.materials));
      var sizeSelect = el('select', { 'aria-label': 'Size' }, optionList(config.sizes));
      var qtyInput = el('input', {
        type: 'number',
        min: String(config.quantity.min),
        max: String(config.quantity.max),
        value: '1',
        'aria-label': 'Quantity'
      });
      var removalCheckbox = el('input', { type: 'checkbox', id: rowId + '-removal' });
      var removalLabel = el('label', { for: rowId + '-removal', text: 'Remove old unit' });
      var removeBtn = el('button', { type: 'button', class: 'row-remove', 'aria-label': 'Remove this item' }, [document.createTextNode('×')]);

      var row = el('div', { class: 'estimator-row' }, [
        el('div', { class: 'field' }, [el('label', { text: 'Item' }), itemTypeSelect]),
        el('div', { class: 'field' }, [el('label', { text: 'Material' }), materialSelect]),
        el('div', { class: 'field' }, [el('label', { text: 'Size' }), sizeSelect]),
        el('div', { class: 'field field-qty' }, [el('label', { text: 'Qty' }), qtyInput]),
        el('div', { class: 'field field-removal' }, [removalCheckbox, removalLabel]),
        removeBtn
      ]);

      var rowState = {
        node: row,
        getSelection: function () {
          return {
            itemTypeId: itemTypeSelect.value,
            materialId: materialSelect.value,
            sizeId: sizeSelect.value,
            quantity: qtyInput.value,
            includeRemoval: removalCheckbox.checked
          };
        }
      };

      [itemTypeSelect, materialSelect, sizeSelect, qtyInput, removalCheckbox].forEach(function (input) {
        input.addEventListener('input', recalc);
        input.addEventListener('change', recalc);
      });

      removeBtn.addEventListener('click', function () {
        if (rows.length <= 1) return;
        rows = rows.filter(function (r) { return r !== rowState; });
        row.remove();
        recalc();
      });

      return rowState;
    }

    function addRow() {
      var row = makeRow();
      rows.push(row);
      rowsWrap.appendChild(row.node);
      recalc();
    }

    function renderTotals(result) {
      totalsPanel.innerHTML = '';

      var lines = el('div', { class: 'totals-lines' });
      result.lines.forEach(function (line) {
        lines.appendChild(el('div', { class: 'totals-line' }, [
          el('span', { text: line.quantity + '× ' + line.material.label + ' ' + line.itemType.label + ' (' + line.size.label + ')' + (line.includeRemoval ? ' + removal' : '') }),
          el('span', { text: currency.format(line.lineTotal) })
        ]));
      });

      var rangeRow = el('div', { class: 'totals-range' }, [
        el('span', { class: 'muted', text: 'Estimated range' }),
        el('span', { class: 'range-amount', text: currency.format(result.rangeLow) + ' – ' + currency.format(result.rangeHigh) })
      ]);

      totalsPanel.appendChild(lines);
      totalsPanel.appendChild(rangeRow);
    }

    function recalc() {
      var selections = rows.map(function (r) { return r.getSelection(); });
      var result = global.EstimatorEngine.estimate(config, selections);
      renderTotals(result);
    }

    container.appendChild(rowsWrap);
    container.appendChild(addBtn);
    container.appendChild(totalsPanel);
    addBtn.addEventListener('click', addRow);

    addRow();
  }

  global.EstimatorUI = { mount: mountEstimator };
})(window);
