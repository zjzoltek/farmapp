$(function() {
  $("#addMedicationButton").on("click", function() {
    $.ajax({
      url: "/add_Medication",
      data: $("#newMidcationRecord").serialize(),
      type: "POST",
      success: function(response) {
        $("#input_medication_name").val("");
        $("#input_start_date").val("");
        $("#input_end_date").val("");
        $("#input_medication_interval").val("");
        window.location.reload();
      }
    });
  });
});
$(function() {
  $("#addVaccinationButton").on("click", function() {
    $.ajax({
      url: "/add_Vaccination",
      data: $("#newVaccinationRecord").serialize(),
      type: "POST",
      success: function(response) {
        $("#input_vaccin_type").val("");
        $("#input_date_given").val("");
        window.location.reload();
      }
    });
  });
});
$(function() {
  $("#addVetVisitButton").on("click", function() {
    $.ajax({
      url: "/add_vetVisit",
      data: $("#newVetVisitRecord").serialize(),
      type: "POST",
      success: function(response) {
        $("#input_vet_name").val("");
        $("#input_visit_date").val("");
        $("#input_visit_cost").val("");
        $("#input_visit_reason").val("");
        $("#input_visit_notes").val("");
        window.location.reload();
      }
    });
  });
});
