/**
 * Generic quote-estimator engine (Open/Closed: new trades are added by writing
 * a new config in js/estimators/*.config.js — this file never changes per trade).
 * Client-side only. Output is a rough estimate for lead-gen, never a binding
 * price — a human confirms the real quote, so there's no server pricing risk here.
 */
(function (global) {
  'use strict';

  function clampNumber(value, min, max, fallback) {
    var n = Number(value);
    if (!Number.isFinite(n)) n = fallback;
    return Math.min(Math.max(n, min), max);
  }

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function computeLineItem(config, selection) {
    var itemType = findById(config.itemTypes, selection.itemTypeId);
    var material = findById(config.materials, selection.materialId);
    var size = findById(config.sizes, selection.sizeId);
    if (!itemType || !material || !size) return null;

    var quantity = clampNumber(selection.quantity, config.quantity.min, config.quantity.max, config.quantity.min);
    var unitPrice = itemType.basePrice * material.multiplier * size.multiplier;
    var removalFee = selection.includeRemoval ? (itemType.removalFee || 0) : 0;
    var lineTotal = (unitPrice + removalFee) * quantity;

    return {
      itemType: itemType,
      material: material,
      size: size,
      quantity: quantity,
      includeRemoval: !!selection.includeRemoval,
      unitPrice: unitPrice,
      removalFee: removalFee,
      lineTotal: lineTotal
    };
  }

  function estimate(config, selections) {
    var lines = selections
      .map(function (s) { return computeLineItem(config, s); })
      .filter(Boolean);

    var subtotal = lines.reduce(function (sum, l) { return sum + l.lineTotal; }, 0);
    var uncertainty = typeof config.uncertainty === 'number' ? config.uncertainty : 0.15;

    return {
      lines: lines,
      subtotal: Math.round(subtotal),
      rangeLow: Math.round(subtotal * (1 - uncertainty)),
      rangeHigh: Math.round(subtotal * (1 + uncertainty))
    };
  }

  global.EstimatorEngine = {
    estimate: estimate,
    computeLineItem: computeLineItem,
    clampNumber: clampNumber
  };
})(window);
