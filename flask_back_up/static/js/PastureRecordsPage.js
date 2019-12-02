$(function() {
  $("#addPastureButton").on("click", function() {
    $.ajax({
      url: "/add_Pasture",
      data: $("#newPastureRecord").serialize(),
      type: "POST",
      success: function(response) {
        $("#input_nickname").val("");
        $("#input_notes").val("");
        window.location.reload();
      }
    });
  });
});

function deletepastureRecord(val) {
  $.ajax({
    url: "/delete_pasture/" + val,
    type: "POST",
    success: function(response) {
      window.location.reload();
    }
  });
}
