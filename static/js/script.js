const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const resultsSection = document.getElementById("results");
const totalCaloriesEl = document.getElementById("totalCalories");
const foodBreakdownEl = document.querySelector(".food-breakdown");

uploadBtn.addEventListener("click", () => {
  // Trigger the hidden file input when the upload button is clicked
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return; // If no file is selected, do nothing

  const fd = new FormData();
  fd.append("image", file);  // Add the file to the FormData

  // Show loading state by changing button text
  uploadBtn.querySelector(".upload-text").textContent = "Analyzing...";

  // Send the file to Flask backend
  fetch("/upload", {
    method: "POST",
    body: fd,  // The image file is sent as part of the FormData
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert("Error: " + data.error); // Show error if any
        return;
      }

      // Update total calories with the result from the API
      totalCaloriesEl.textContent = data.total_calories;

      // Clear the current food breakdown and update with new data
      foodBreakdownEl.innerHTML = "";
      data.items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "food-item-row";
        div.innerHTML = `
          <span class="food-name">${item.label}</span>
          <span class="food-calories">${item.calories} kcal</span>
        `;
        foodBreakdownEl.appendChild(div);  // Append each food item to the list
      });

      // Display the results section now that data is available
      resultsSection.style.display = "block";

      // Reset the upload button text after the upload is completed
      uploadBtn.querySelector(".upload-text").textContent = "Upload Meal Pic";
    })
    .catch((err) => {
      alert("Failed to upload: " + err.message);  // Handle any errors during upload
      uploadBtn.querySelector(".upload-text").textContent = "Upload Meal Pic";  // Reset button text
    });
});
