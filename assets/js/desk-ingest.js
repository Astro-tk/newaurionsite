/*
 * Aurion Desk copy of website enquiries.
 *
 * Formspree stays the primary destination: the page waits for Formspree only. This script
 * sends a second copy to Aurion Desk (https://desk.aurioncreative.com/api/ingest/form) in the
 * background. If Desk is slow or down, the visitor never notices and the lead is still in
 * Formspree.
 *
 * Consent: Desk records consent only when the visitor ticked the box. The exact wording shown
 * is sent with it, so the record proves what they agreed to.
 */
(function () {
  "use strict";

  var DESK_INGEST_URL = "https://desk.aurioncreative.com/api/ingest/form";
  var CONSENT_WORDING = "Aurion may contact me about this enquiry.";

  function text(value, max) {
    return String(value == null ? "" : value).trim().slice(0, max);
  }

  /**
   * fields: { name, email, phone, company, message }
   * form:   the <form> element (for the honeypot and the consent box)
   * formId: "homepage", "pricing" or "contact"
   */
  function sendToDesk(form, formId, fields) {
    try {
      var consentBox = form.querySelector('input[name="consent"]');
      var honeypot = form.querySelector('input[name="_gotcha"]');
      // Keep only the bio-page source ("from" and "via"), never any other query value.
      var query = new URLSearchParams(window.location.search);
      var source = new URLSearchParams();
      ["from", "via"].forEach(function (k) {
        var v = query.get(k);
        if (v && /^[A-Za-z0-9_-]{1,30}$/.test(v)) source.set(k, v);
      });
      var payload = {
        form_id: formId,
        page_url: window.location.origin + window.location.pathname + (source.toString() ? "?" + source.toString() : ""),
        name: text(fields.name, 120),
        email: text(fields.email, 200),
        phone: text(fields.phone, 40),
        company: text(fields.company, 200),
        message: text(fields.message, 5000),
        consent: Boolean(consentBox && consentBox.checked),
        consent_wording: consentBox && consentBox.checked ? CONSENT_WORDING : "",
        _gotcha: honeypot ? honeypot.value : ""
      };
      fetch(DESK_INGEST_URL, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(function () {
        /* Desk is a copy; Formspree already has the lead. */
      });
    } catch (e) {
      /* Never let the copy break the form. */
    }
  }

  window.aurionDesk = { send: sendToDesk, consentWording: CONSENT_WORDING };
})();
