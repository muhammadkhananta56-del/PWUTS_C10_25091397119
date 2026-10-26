(function (window, $) {
  "use strict";
  const serviceData = {
    "1": { name: "Fast Clean", price: 35000, duration: "1–2 hari" },
    "2": { name: "Deep Clean", price: 55000, duration: "2–3 hari" },
    "3": { name: "Premium Care", price: 85000, duration: "3–4 hari" }
  };
  const money = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

  const booking = {
    initialized: false,
    step: 1,
    init() {
      if (this.initialized) return;
      this.initialized = true;
      const form = document.getElementById("booking-form");
      if (!form) return;
      const date = document.getElementById("preferred_date");
      if (date) {
        const today = new Date();
        date.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
      }
      $(document).on("change.stepclean", '#booking-form input[name="service_id"], #booking-form #shoe_count', () => this.updateLiveSummary());
      $(document).on("change.stepclean", '#booking-form input[name="service_mode"]', () => this.toggleAddress());
      $("#next-step").on("click.stepclean", () => this.next());
      $("#previous-step").on("click.stepclean", () => this.previous());
      $("#booking-form").on("submit.stepclean", event => this.submit(event));
      this.updateServiceSelection();
      this.toggleAddress();
      this.updateLiveSummary();
    },
    getForm() { return document.getElementById("booking-form"); },
    getData() {
      const form = this.getForm();
      const data = Object.fromEntries(new FormData(form).entries());
      data.shoe_count = Number(data.shoe_count || 1);
      data.service = serviceData[data.service_id] || serviceData["2"];
      data.total = data.service.price * data.shoe_count;
      return data;
    },
    validateStep(step) {
      const form = this.getForm();
      const panel = form.querySelector(`.booking-step[data-step="${step}"]`);
      if (!panel) return true;
      const fields = Array.from(panel.querySelectorAll("input, select, textarea")).filter(el => !el.disabled && el.type !== "radio" && el.type !== "checkbox");
      for (const field of fields) {
        if (field.id === "email" && field.value.trim() === "") continue;
        if (field.id === "address" && !panel.querySelector('input[name="service_mode"]:checked')?.value.includes("pickup")) continue;
        if (!field.checkValidity()) {
          field.reportValidity();
          field.focus();
          return false;
        }
      }
      if (step === 1 && !panel.querySelector('input[name="service_id"]:checked')) {
        this.message("Pilih salah satu layanan terlebih dahulu.");
        return false;
      }
      if (step === 2) {
        const phone = form.phone.value.trim();
        if (!/^[0-9+().\-\s]{8,20}$/.test(phone)) {
          form.phone.setCustomValidity("Masukkan nomor telepon yang valid (8–20 karakter).");
          form.phone.reportValidity(); form.phone.setCustomValidity(""); form.phone.focus(); return false;
        }
        const mode = form.querySelector('input[name="service_mode"]:checked')?.value;
        if (mode === "pickup" && !form.address.value.trim()) {
          form.address.setCustomValidity("Alamat diperlukan untuk opsi jemput/antar.");
          form.address.reportValidity(); form.address.setCustomValidity(""); form.address.focus(); return false;
        }
      }
      return true;
    },
    next() {
      if (!this.validateStep(this.step)) return;
      if (this.step < 3) this.goTo(this.step + 1);
    },
    previous() { if (this.step > 1) this.goTo(this.step - 1); },
    goTo(step) {
      this.step = step;
      document.querySelectorAll(".booking-step").forEach(panel => panel.classList.toggle("active", Number(panel.dataset.step) === step));
      const titles = {1:"Pilih layanan",2:"Detail pelanggan",3:"Ringkasan transaksi"};
      document.getElementById("step-label").textContent = `LANGKAH ${step} DARI 3`;
      document.getElementById("step-title").textContent = titles[step];
      document.getElementById("progress-count").textContent = `${Math.round(step/3*100)}%`;
      document.getElementById("progress-bar").style.width = `${step/3*100}%`;
      document.getElementById("previous-step").disabled = step === 1;
      document.getElementById("next-step").classList.toggle("hidden", step === 3);
      document.getElementById("submit-booking").classList.toggle("hidden", step !== 3);
      document.getElementById("booking-feedback").textContent = "";
      if (step === 3) this.renderTransactionSummary();
      document.getElementById("step-title").scrollIntoView({ behavior:"smooth", block:"nearest" });
    },
    updateServiceSelection() {
      document.querySelectorAll(".service-option").forEach(label => {
        label.classList.toggle("selected", Boolean(label.querySelector('input[name="service_id"]:checked')));
      });
    },
    toggleAddress() {
      const mode = document.querySelector('#booking-form input[name="service_mode"]:checked')?.value;
      const wrap = document.getElementById("address-wrap");
      if (!wrap) return;
      wrap.classList.toggle("hidden", mode !== "pickup");
      const address = document.getElementById("address");
      address.required = mode === "pickup";
    },
    updateLiveSummary() {
      if (!document.getElementById("booking-form")) return;
      this.updateServiceSelection();
      const data = this.getData();
      $("#aside-price").text(money(data.total));
      $("#aside-service").text(data.service.name);
      $("#aside-count").text(`${data.shoe_count} pasang`);
      $("#aside-duration").text(data.service.duration);
    },
    renderTransactionSummary() {
      const d = this.getData();
      const mode = d.service_mode === "pickup" ? "Jemput / antar (perlu konfirmasi)" : "Antar ke toko";
      const rows = [
        ["Layanan", d.service.name],
        ["Jumlah sepatu", `${d.shoe_count} pasang`],
        ["Jenis / bahan", d.shoe_type],
        ["Nama pelanggan", d.customer_name],
        ["Nomor telepon", d.phone],
        ["Email", d.email || "Tidak diisi"],
        ["Metode serah terima", mode],
        ["Alamat", d.service_mode === "pickup" ? d.address : "Tidak diperlukan"],
        ["Tanggal rencana", d.preferred_date],
        ["Estimasi selesai", d.service.duration],
        ["Catatan", d.shoe_notes || "Tidak ada"]
      ];
      const box = document.getElementById("transaction-summary");
      box.innerHTML = `<div class="summary-head"><b>Detail booking</b><span>Step Clean</span></div>` +
        rows.map(([label,value]) => `<div class="summary-line"><span>${this.escape(label)}</span><strong>${this.escape(String(value))}</strong></div>`).join("") +
        `<div class="summary-line summary-total"><span>Estimasi biaya layanan</span><strong>${money(d.total)}</strong></div>`;
    },
    escape(value) {
      return value.replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));
    },
    message(text, success=false) {
      const box = document.getElementById("booking-feedback");
      box.textContent = text;
      box.classList.toggle("success", success);
    },
    async submit(event) {
      event.preventDefault();
      if (this.step !== 3 || !this.validateStep(3)) return;
      if (!document.getElementById("confirm-data").checked) {
        this.message("Centang persetujuan setelah memeriksa ringkasan transaksi.");
        return;
      }
      const button = document.getElementById("submit-booking");
      button.disabled = true;
      button.textContent = "Mengirim...";
      this.message("");
      try {
        const response = await fetch("backend/booking.php", { method:"POST", body:new FormData(this.getForm()), headers:{ "Accept":"application/json" } });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Booking gagal disimpan.");
        this.message(`Booking berhasil disimpan. Nomor pesanan: ${result.order_number}. Simpan nomor ini untuk cek status.`, true);
        this.getForm().reset();
        this.step = 1;
        this.goTo(1);
        this.updateLiveSummary();
        const feedback = document.getElementById("booking-feedback");
        feedback.textContent = `Booking berhasil disimpan. Nomor pesanan: ${result.order_number}. Simpan nomor ini untuk cek status.`;
        feedback.classList.add("success");
        const summary = document.getElementById("transaction-summary");
        if (summary) summary.innerHTML = "";
        window.StepCleanLastOrder = result.order_number;
      } catch (error) {
        this.message(error.message + " Pastikan PHP dan MySQL sudah dijalankan serta konfigurasi database benar.");
      } finally {
        button.disabled = false;
        button.innerHTML = 'Kirim Booking <span>↗</span>';
      }
    }
  };
  window.StepCleanBooking = booking;
})(window, window.jQuery);
