const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const resultsSection = document.getElementById("results");
const totalCaloriesEl = document.getElementById("totalCalories");
const foodBreakdownEl = document.querySelector(".food-breakdown");

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const fd = new FormData();
  fd.append("image", file);

  // Loading state
  uploadBtn.classList.add("loading");
  uploadBtn.querySelector(".upload-text").textContent = "Analyzing...";

  fetch("/upload", {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      // Update total calories
      totalCaloriesEl.textContent = data.total_calories;

      // Clear and update breakdown
      foodBreakdownEl.innerHTML = "";
      data.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "food-item-row";
        div.innerHTML = `
          <span class="food-name">${item.label}</span>
          <span class="food-calories">${item.calories} kcal</span>
        `;
        foodBreakdownEl.appendChild(div);
      });

      // Reset button
      uploadBtn.classList.remove("loading");
      uploadBtn.querySelector(".upload-text").textContent = "Upload Meal Pic";
    })
    .catch((err) => {
      alert("Failed to upload: " + err.message);
      uploadBtn.classList.remove("loading");
      uploadBtn.querySelector(".upload-text").textContent = "Upload Meal Pic";
    });
});
