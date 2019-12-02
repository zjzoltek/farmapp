$(function() {
  $("#addMaintenanceButton").on("click", function() {
    $.ajax({
      url: "/add_maintenanceitem",
      data: $("#newVaccinationRecord").serialize(),
      type: "POST",
      success: function(response) {
        $("#input_type").val("");
        $("#input_cost").val("");
        $("#input_notes").val("");
        window.location.reload();
      }
    });
  });
});

function deletemaintenanceRecord(val) {
  $.ajax({
    url: "/delete_maintenance/" + val,
    type: "POST",
    success: function(response) {
      window.location.reload();
    }
  });
}
