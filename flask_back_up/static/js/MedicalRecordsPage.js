$(function() {
  $("#addMedicationButton").on("click", function() {
    console.log("button was clicked");
    $.ajax({
      url: "/add_Medication",
      data: $("#newMidcationRecord").serialize(),
      type: "POST",
      success: function(response) {
        window.location.reload();
      }
    });
  });
});
