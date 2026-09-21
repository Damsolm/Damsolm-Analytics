/* =========================================================
   DAMSOLM PARENTING — Thank You Page JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Keep the copyright year current.
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Small confirmation message after the visitor activates the PDF download.
  const downloadButton = document.getElementById("downloadButton");
  const downloadStatus = document.getElementById("downloadStatus");

  if (downloadButton && downloadStatus) {
    downloadButton.addEventListener("click", function () {
      downloadStatus.textContent =
        "Your bonus guide is being prepared for download.";

      window.setTimeout(function () {
        downloadStatus.textContent = "";
      }, 5000);
    });
  }
});
