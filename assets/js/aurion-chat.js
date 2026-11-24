/*
  Aurion Assistant: the website chat widget.

  It only talks to Aurion's own backend (API_URL below). No API key or secret is ever in
  this file or in the browser.

  CHAT_LIVE is the switch for the public site:
    false: the widget loads only on test-chat.html (for testing before go-live)
    true:  the widget loads on every page that includes this script
  To roll back after go-live, set CHAT_LIVE back to false.
*/
(function () {
  "use strict";

  const CHAT_LIVE = false;

  const API_URL = "https://api.aurioncreative.com/api/chat";
  const PRIVACY_URL = "privacy.html";
  const WHATSAPP_URL = "https://wa.me/27655465919";
  const WHATSAPP_TEXT = "+27 65 546 5919";
  const EMAIL = "info@aurioncreative.com";
  const MAX_CHARS = 1000;
  const GREETING =
    "Hello. I'm Aurion's assistant. Ask me about our AI systems, chatbots, custom software, Project Command or BeeLevel.";
  const FALLBACK =
    "Sorry, I can't answer right now. Please reach the team on WhatsApp at " + WHATSAPP_TEXT + " or email " + EMAIL + ".";

  const isTestPage = /\/test-chat(\.html)?$/.test(window.location.pathname);
  if (!CHAT_LIVE && !isTestPage) return;
  if (document.getElementById("aurion-chat")) return;

  // ---------- small helpers ----------

  function store(kind) {
    try {
      const s = window[kind];
      const probe = "__aurion_probe__";
      s.setItem(probe, "1");
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }
  const local = store("localStorage");
  const session = store("sessionStorage");

  function newId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    let id = "";
    for (let i = 0; i < 32; i++) id += Math.floor(Math.random() * 16).toString(16);
    return id;
  }

  function sessionId() {
    let id = local && local.getItem("aurion-chat-session");
    if (!id || !/^[A-Za-z0-9-]{16,64}$/.test(id)) {
      id = newId();
      if (local) local.setItem("aurion-chat-session", id);
    }
    return id;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // Plain text in, safe DOM out: only http(s) links and email addresses become links.
  function renderText(container, text) {
    const pattern = /(https?:\/\/[^\s<>"')]+[^\s<>"').,;:]|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
    text.split("\n").forEach(function (line, i) {
      if (i > 0) container.appendChild(document.createElement("br"));
      let last = 0;
      line.replace(pattern, function (match, _g, offset) {
        container.appendChild(document.createTextNode(line.slice(last, offset)));
        const isMail = match.indexOf("@") > -1 && match.indexOf("http") !== 0;
        const a = el("a", {
          href: isMail ? "mailto:" + match : match,
          target: isMail ? "_self" : "_blank",
          rel: "noopener",
          text: match,
        });
        container.appendChild(a);
        last = offset + match.length;
        return match;
      });
      container.appendChild(document.createTextNode(line.slice(last)));
    });
  }

  // ---------- build the widget ----------

  document.body.classList.add("has-aurion-chat");
  if (document.querySelector('a[aria-label="Chat on WhatsApp"]')) document.body.classList.add("has-wa-float");

  const launcher = el(
    "button",
    {
      type: "button",
      class: "aurion-chat-launcher",
      "aria-label": "Open Aurion Assistant",
      "aria-expanded": "false",
      "aria-controls": "aurion-chat",
    },
    [el("iconify-icon", { icon: "lucide:message-circle", "aria-hidden": "true" })],
  );

  const log = el("div", { class: "aurion-chat-log", role: "log", "aria-live": "polite", "aria-label": "Conversation" });
  const input = el("textarea", {
    class: "aurion-chat-input",
    rows: "1",
    maxlength: String(MAX_CHARS),
    placeholder: "Type your question",
    "aria-label": "Your message",
  });
  const send = el("button", { type: "submit", class: "aurion-chat-send", "aria-label": "Send" }, [
    el("iconify-icon", { icon: "lucide:arrow-up", "aria-hidden": "true" }),
  ]);
  const form = el("form", { class: "aurion-chat-form" }, [input, send]);
  const notice = el("p", { class: "aurion-chat-notice" }, [
    "AI assistant. Chats are kept for 90 days. ",
    el("a", { href: PRIVACY_URL, text: "Privacy notice" }),
  ]);
  const close = el("button", { type: "button", class: "aurion-chat-close", "aria-label": "Close chat" }, [
    el("iconify-icon", { icon: "lucide:x", "aria-hidden": "true" }),
  ]);
  const header = el("div", { class: "aurion-chat-header" }, [
    el("div", {}, [
      el("p", { class: "aurion-chat-title", text: "Aurion Assistant" }),
      el("p", { class: "aurion-chat-sub", text: "A person replies after 18:00 on weekdays, or on Saturday." }),
    ]),
    close,
  ]);
  const panel = el(
    "div",
    { id: "aurion-chat", class: "aurion-chat-panel", role: "dialog", "aria-label": "Aurion Assistant", hidden: "" },
    [header, log, notice, form],
  );

  document.body.appendChild(panel);
  document.body.appendChild(launcher);

  // ---------- conversation ----------

  let history = [];
  try {
    history = JSON.parse((session && session.getItem("aurion-chat-history")) || "[]");
    if (!Array.isArray(history)) history = [];
  } catch (e) {
    history = [];
  }

  function save() {
    if (!session) return;
    try {
      session.setItem("aurion-chat-history", JSON.stringify(history.slice(-60)));
    } catch (e) {
      /* storage full or blocked: the chat still works */
    }
  }

  function bubble(role, text) {
    const b = el("div", { class: "aurion-chat-msg aurion-chat-" + role });
    renderText(b, text);
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }

  function addMessage(role, text) {
    history.push({ role: role, text: text });
    save();
    bubble(role, text);
  }

  function closedForGood() {
    input.disabled = true;
    send.disabled = true;
    input.placeholder = "This chat has ended";
  }

  bubble("bot", GREETING);
  history.forEach(function (m) {
    bubble(m.role, m.text);
  });
  if (session && session.getItem("aurion-chat-ended") === "1") closedForGood();

  let busy = false;
  function setBusy(on) {
    busy = on;
    send.disabled = on;
    panel.classList.toggle("is-busy", on);
  }

  function ask(text) {
    addMessage("user", text);
    setBusy(true);
    const typing = el("div", { class: "aurion-chat-msg aurion-chat-bot aurion-chat-typing", "aria-label": "Assistant is typing" }, [
      el("span"),
      el("span"),
      el("span"),
    ]);
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    const controller = "AbortController" in window ? new AbortController() : null;
    const timer = setTimeout(function () {
      if (controller) controller.abort();
    }, 30000);

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionId(), message: text }),
      signal: controller ? controller.signal : undefined,
    })
      .then(function (res) {
        return res.json().catch(function () {
          return {};
        });
      })
      .then(function (data) {
        const reply = data && typeof data.reply === "string" && data.reply ? data.reply : FALLBACK;
        typing.remove();
        addMessage("bot", reply);
        if (data && data.limitReached) {
          if (session) session.setItem("aurion-chat-ended", "1");
          closedForGood();
        }
      })
      .catch(function () {
        typing.remove();
        addMessage("bot", FALLBACK);
      })
      .then(function () {
        clearTimeout(timer);
        setBusy(false);
        if (!input.disabled) input.focus();
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = input.value.trim().slice(0, MAX_CHARS);
    if (!text || busy || input.disabled) return;
    input.value = "";
    input.style.height = "";
    ask(text);
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });

  input.addEventListener("input", function () {
    input.style.height = "";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  });

  // ---------- open and close ----------

  function open() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Close Aurion Assistant");
    document.body.classList.add("aurion-chat-open");
    log.scrollTop = log.scrollHeight;
    if (!input.disabled) input.focus();
  }

  function shut() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Open Aurion Assistant");
    document.body.classList.remove("aurion-chat-open");
    launcher.focus();
  }

  launcher.addEventListener("click", function () {
    panel.hidden ? open() : shut();
  });
  close.addEventListener("click", shut);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) shut();
  });
})();
