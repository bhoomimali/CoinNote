// Shared AI widget behavior and simple rule-based "agent"
(function () {
  const widget = document.getElementById("ai-widget");
  const toggleBtn = document.getElementById("ai-widget-toggle");
  const closeBtn = document.getElementById("ai-widget-close");
  const form = document.getElementById("ai-form");
  const input = document.getElementById("ai-input");
  const messages = document.getElementById("ai-messages");

  if (toggleBtn && widget) {
    toggleBtn.addEventListener("click", () => {
      const open = widget.classList.toggle("open");
      widget.setAttribute("aria-hidden", open ? "false" : "true");
      if (open && input) {
        setTimeout(() => input.focus(), 120);
      }
    });
  }

  if (closeBtn && widget) {
    closeBtn.addEventListener("click", () => {
      widget.classList.remove("open");
      widget.setAttribute("aria-hidden", "true");
    });
  }

  function appendMessage(text, from = "bot") {
    if (!messages) return;
    const div = document.createElement("div");
    div.className = `ai-message ${from === "bot" ? "ai-message-bot" : "ai-message-user"}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function tarsReply(userText) {
    const text = userText.toLowerCase();

    if (text.includes("kyc")) {
      return "For KYC, upload a clear photo of your PAN/Aadhaar and ensure the name matches your bank records. TARS will auto-verify and pre-fill your details.";
    }
    if (text.includes("sip") || text.includes("systematic")) {
      return "SIP (Systematic Investment Plan) lets you invest a fixed amount every month. It's great for students because you can start small and benefit from rupee cost averaging.";
    }
    if (text.includes("mutual") || text.includes("fund")) {
      return "Mutual funds pool money from many investors and are managed by professionals. In CoinNote you can choose risk level (conservative, balanced, aggressive) and TARS suggests suitable funds.";
    }
    if (text.includes("loan")) {
      return "Student and personal loans in CoinNote are based on your profile. Keep your KYC and income/college details ready for faster approval.";
    }
    if (text.includes("account") || text.includes("savings")) {
      return "The Student Savings Account gives you zero balance, a free virtual debit card, and smart spending insights from TARS.";
    }
    if (text.includes("risk")) {
      return "Conservative = more stable, lower returns. Balanced = mix of stability and growth. Aggressive = higher risk for higher long-term returns. Choose based on how long you can stay invested and how much fluctuation you are comfortable with.";
    }
    if (text.includes("password")) {
      return "Use at least 8 characters with a mix of letters, numbers, and symbols. Avoid reusing passwords from other apps.";
    }

    if (text.includes("fraud") || text.includes("risk")) {
      return "TARS runs background fraud checks including device fingerprinting, behaviour analysis, and image forensics. High-risk cases are never auto-approved and are sent to a compliance officer.";
    }

    if (text.includes("selfie") || text.includes("face")) {
      return "During selfie verification, TARS checks that the face is live (not a photo of a photo) and that it matches the ID image within a safe threshold before continuing.";
    }

    return "I'm TARS, your CoinNote assistant. I help with onboarding, KYC, document upload, selfie verification, fraud checks, mutual funds, SIPs, offers, and account setup. Ask me something specific like “How does fraud detection work?” or “What documents do I need for KYC?”";
  }

  if (form && input && messages) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      appendMessage(value, "user");
      input.value = "";

      // Simulate thinking delay
      setTimeout(() => {
        appendMessage(tarsReply(value), "bot");
      }, 450);
    });
  }

  // 3-step verification flow (documents → selfie → fraud checks)
  const mfStepLabel = document.getElementById("mf-step-label");
  const mfProgressBar = document.getElementById("mf-progress-bar");
  const mfNext1 = document.getElementById("mf-next-1");
  const mfNext2 = document.getElementById("mf-next-2");
  const mfPrevButtons = document.querySelectorAll(".mf-prev");
  const mfSubmit = document.getElementById("mf-submit");
  const mfReview = document.getElementById("mf-review");
  const statusDocs = document.getElementById("status-docs");
  const statusFace = document.getElementById("status-face");
  const statusRisk = document.getElementById("status-risk");

  function setStep(step) {
    document
      .querySelectorAll(".flow-card[data-step]")
      .forEach((section) => {
        const s = section.getAttribute("data-step");
        section.hidden = String(step) !== s;
      });
    if (mfStepLabel) mfStepLabel.textContent = String(step);
    if (mfProgressBar) mfProgressBar.style.width = `${step * 33}%`;
  }

  if (mfNext1) {
    mfNext1.addEventListener("click", () => {
      const docsOk =
        document.getElementById("file-list") &&
        document.getElementById("file-list").children.length > 0;
      if (!docsOk) {
        alert("Please upload at least one ID document before continuing.");
        return;
      }
      setStep(2);
    });
  }

  if (mfNext2) {
    mfNext2.addEventListener("click", () => {
      const selfieOk =
        document.getElementById("selfie-file-list") &&
        document.getElementById("selfie-file-list").children.length > 0;
      if (!selfieOk) {
        alert("Please capture or upload a selfie for face verification.");
        return;
      }
      setStep(3);
    });
  }

  if (mfPrevButtons.length) {
    mfPrevButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const prev = btn.getAttribute("data-prev");
        if (prev) setStep(Number(prev));
      });
    });
  }

  if (mfSubmit) {
    mfSubmit.addEventListener("click", () => {
      if (statusDocs && statusFace && statusRisk) {
        statusDocs.textContent = "Running OCR + document checks...";
        statusFace.textContent = "Verifying face match & liveness...";
        statusRisk.textContent = "Computing fraud risk score...";
        mfSubmit.disabled = true;

        setTimeout(() => {
          statusDocs.textContent = "Verified by OCR";
          statusFace.textContent = "Face matched • Liveness OK";
          statusRisk.textContent = "Low risk • Auto-approval";

          setTimeout(() => {
            alert(
              "Verification and fraud checks completed successfully! TARS has cleared this onboarding step."
            );
            mfSubmit.disabled = false;
            setStep(1);
          }, 900);
        }, 900);
      } else {
        alert("Verification completed for this service. TARS will keep you updated.");
        setStep(1);
      }
    });
  }

  // Document + selfie upload helpers
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const fileList = document.getElementById("file-list");

  const selfieDropZone = document.getElementById("selfie-drop-zone");
  const selfieFileInput = document.getElementById("selfie-file-input");
  const selfieFileList = document.getElementById("selfie-file-list");

  function renderFileList(listElement, files) {
    if (!listElement) return;
    listElement.innerHTML = "";
    Array.from(files).forEach((file) => {
      const li = document.createElement("li");
      li.textContent = file.name;
      listElement.appendChild(li);
    });
  }

  if (dropZone && fileInput && fileList) {
    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
      if (e.dataTransfer?.files?.length) {
        renderFileList(fileList, e.dataTransfer.files);
      }
    });

    fileInput.addEventListener("change", (e) => {
      const target = e.target;
      if (target.files?.length) {
        renderFileList(fileList, target.files);
      }
    });
  }

  if (selfieDropZone && selfieFileInput && selfieFileList) {
    selfieDropZone.addEventListener("click", () => selfieFileInput.click());

    selfieDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      selfieDropZone.classList.add("drag-over");
    });

    selfieDropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      selfieDropZone.classList.remove("drag-over");
    });

    selfieDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      selfieDropZone.classList.remove("drag-over");
      if (e.dataTransfer?.files?.length) {
        renderFileList(selfieFileList, e.dataTransfer.files);
      }
    });

    selfieFileInput.addEventListener("change", (e) => {
      const target = e.target;
      if (target.files?.length) {
        renderFileList(selfieFileList, target.files);
      }
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Account created! Redirecting you to the dashboard preview.");
      window.location.href = "dashboard.html";
    });
  }

  // Dynamic titles/descriptions for service flow based on ?service=
  const serviceTitle = document.getElementById("service-title");
  const docsDescription = document.getElementById("docs-description");
  if (serviceTitle) {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service") || "onboarding";
    const map = {
      kyc: {
        title: "KYC Verification",
        docs: "Upload your PAN, Aadhaar, or passport for identity verification.",
      },
      "mutual-funds": {
        title: "Mutual Funds Application",
        docs: "Upload your ID and any required income proof for investment eligibility.",
      },
      sip: {
        title: "SIP Investment Setup",
        docs: "Upload your ID and bank proof to link your SIP mandate.",
      },
      "personal-loan": {
        title: "Personal Loan Application",
        docs: "Upload your ID, income proof, and address document to start loan evaluation.",
      },
      "wealth-management": {
        title: "Wealth Management Onboarding",
        docs: "Upload your ID and existing portfolio statement for advisory setup.",
      },
      "international-banking": {
        title: "International Banking Setup",
        docs: "Upload your ID and address proof for cross-border compliance checks.",
      },
      onboarding: {
        title: "Customer Onboarding",
        docs: "Upload your government-issued ID to begin onboarding.",
      },
    };
    const cfg = map[service] || map.onboarding;
    serviceTitle.textContent = cfg.title;
    if (docsDescription) docsDescription.textContent = cfg.docs;
  }
})();

