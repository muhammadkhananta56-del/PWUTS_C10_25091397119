(function (window, $) {
  "use strict";
  const tracking = {
    initialized: false,
    init() {
      if (this.initialized) return;
      this.initialized = true;
      $(document).on("submit.stepcleantracking", "#tracking-form", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const button = form.querySelector("button[type=submit]");
        const output = document.getElementById("tracking-result");
        button.disabled = true;
        button.textContent = "Memeriksa...";
        output.textContent = "";
        try {
          const response = await fetch("backend/tracking.php", {method:"POST",body:new FormData(form),headers:{"Accept":"application/json"}});
          const data = await response.json();
          if (!response.ok || !data.success) throw new Error(data.message || "Pesanan tidak ditemukan.");
          output.innerHTML = `<div class="tracking-box"><h3>Pesanan ${this.escape(data.order_number)}</h3><p><b>Status:</b> ${this.escape(data.status)}</p><p><b>Layanan:</b> ${this.escape(data.service_name)}</p><p><b>Jumlah:</b> ${this.escape(String(data.shoe_count))} pasang</p><p><b>Tanggal booking:</b> ${this.escape(data.created_at)}</p><p><b>Estimasi:</b> ${this.escape(data.estimated_completion || "Belum ditentukan")}</p></div>`;
        } catch (error) {
          output.textContent = error.message + " Jika belum memiliki nomor pesanan, lakukan booking terlebih dahulu.";
        } finally {
          button.disabled = false;
          button.innerHTML = 'Cek Status <span>→</span>';
        }
      });
    },
    escape(value) { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }
  };
  window.StepCleanTracking = tracking;
})(window, window.jQuery);
